// Package todoist offers tasks from a Todoist filter, through a personal API token.
package todoist

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"
	"time"

	"github.com/jameynakama/whatnow/internal/integrations"
)

const (
	apiBase = "https://api.todoist.com/api/v1"
	// maxTickets caps what a pull offers. A pick list longer than this means the filter is too broad.
	maxTickets = 50
	// pageSize and maxPages bound how far a pull reads, so More is exact up to pageSize*maxPages.
	pageSize = 50
	maxPages = 4
)

var errUnreachable = errors.New("Can't reach Todoist")

// Todoist is the Todoist integration.
type Todoist struct {
	client *http.Client
	base   string
}

// New returns the integration. A nil client means one that gives up after 30 seconds.
func New(client *http.Client) *Todoist {
	if client == nil {
		client = &http.Client{Timeout: 30 * time.Second}
	}
	return &Todoist{client: client, base: apiBase}
}

func (*Todoist) ID() string                { return "todoist" }
func (*Todoist) Name() string              { return "Todoist" }
func (*Todoist) Pulls() integrations.Pulls { return integrations.PullsTickets }

func (*Todoist) Fields() []integrations.Field {
	return []integrations.Field{
		{Key: "token", Label: "API token", Kind: integrations.Secret, Required: true, Help: "In Todoist: Settings → Integrations → Developer"},
		{Key: "filter", Label: "Filter", Kind: integrations.Text, Required: true, Help: "Todoist filter syntax, such as: today | overdue"},
	}
}

// Pull runs the filter. The window is ignored: a Todoist task isn't for a day.
func (t *Todoist) Pull(ctx context.Context, cfg integrations.Config, _, _ time.Time) []integrations.Source {
	src := integrations.Source{Label: "Todoist"}
	src.Tickets, src.More, src.Err = t.search(ctx, cfg)
	return []integrations.Source{src}
}

type task struct {
	ID          string `json:"id"`
	Content     string `json:"content"`
	Description string `json:"description"`
	Priority    int    `json:"priority"` // 4 is p1, the most urgent
}

type page struct {
	Results    []task  `json:"results"`
	NextCursor *string `json:"next_cursor"`
}

// search returns the matching tasks, most urgent first, and how many more matched. Its errors
// never wrap the client's, and never hold the token.
func (t *Todoist) search(ctx context.Context, cfg integrations.Config) ([]integrations.Ticket, int, error) {
	var all []task
	cursor := ""
	for i := 0; i < maxPages; i++ {
		p, err := t.fetch(ctx, cfg, cursor)
		if err != nil {
			return nil, 0, err
		}
		all = append(all, p.Results...)
		if p.NextCursor == nil || *p.NextCursor == "" {
			break
		}
		cursor = *p.NextCursor
	}
	sort.SliceStable(all, func(a, b int) bool { return all[a].Priority > all[b].Priority })
	more := max(len(all)-maxTickets, 0)
	all = all[:len(all)-more]
	tickets := make([]integrations.Ticket, 0, len(all))
	for _, tk := range all {
		tickets = append(tickets, integrations.Ticket{
			Key:   "todoist-" + tk.ID,
			Title: tk.Content,
			Notes: tk.Description,
			URL:   "https://app.todoist.com/app/task/" + tk.ID,
		})
	}
	return tickets, more, nil
}

func (t *Todoist) fetch(ctx context.Context, cfg integrations.Config, cursor string) (page, error) {
	q := url.Values{"query": {cfg.Values["filter"]}, "limit": {fmt.Sprint(pageSize)}}
	if cursor != "" {
		q.Set("cursor", cursor)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, t.base+"/tasks/filter?"+q.Encode(), nil)
	if err != nil {
		return page{}, errUnreachable
	}
	req.Header.Set("Authorization", "Bearer "+cfg.Values["token"])
	req.Header.Set("Accept", "application/json")
	resp, err := t.client.Do(req)
	if err != nil {
		return page{}, errUnreachable
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return page{}, errUnreachable
	}
	switch resp.StatusCode {
	case http.StatusOK:
	case http.StatusUnauthorized, http.StatusForbidden:
		return page{}, errors.New("Todoist rejected the token")
	case http.StatusBadRequest:
		msg := strings.TrimSpace(string(body))
		if msg == "" || len(msg) > 200 || strings.HasPrefix(msg, "<") {
			return page{}, errors.New("Todoist didn't accept the filter")
		}
		return page{}, fmt.Errorf("Todoist didn't accept the filter: %s", msg)
	default:
		return page{}, fmt.Errorf("Todoist answered %d", resp.StatusCode)
	}
	var p page
	if err := json.Unmarshal(body, &p); err != nil {
		return page{}, errors.New("couldn't read Todoist's answer")
	}
	return p, nil
}
