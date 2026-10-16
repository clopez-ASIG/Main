package todoist

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"

	"github.com/jameynakama/whatnow/internal/integrations"
)

const token = "secret-token"

func server(t *testing.T, status int, body string) (*Todoist, *http.Request) {
	t.Helper()
	got := &http.Request{}
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		*got = *r.Clone(context.Background())
		w.WriteHeader(status)
		w.Write([]byte(body))
	}))
	t.Cleanup(srv.Close)
	td := New(nil)
	td.base = srv.URL
	return td, got
}

func cfg() integrations.Config {
	return integrations.Config{Values: map[string]string{"token": token, "filter": "today | overdue"}}
}

func pull(t *testing.T, td *Todoist) integrations.Source {
	t.Helper()
	sources := td.Pull(context.Background(), cfg(), time.Time{}, time.Time{})
	if len(sources) != 1 || sources[0].Label != "Todoist" {
		t.Fatalf("sources = %+v", sources)
	}
	return sources[0]
}

const tasks = `{"results": [
	{"id": "a1", "content": "Low one", "description": "", "priority": 1},
	{"id": "b2", "content": "Urgent one", "description": "see notes", "priority": 4}
], "next_cursor": null}`

func TestPullOffersTasksMostUrgentFirst(t *testing.T) {
	td, got := server(t, http.StatusOK, tasks)
	src := pull(t, td)

	want := []integrations.Ticket{
		{Key: "todoist-b2", Title: "Urgent one", Notes: "see notes", URL: "https://app.todoist.com/app/task/b2"},
		{Key: "todoist-a1", Title: "Low one", URL: "https://app.todoist.com/app/task/a1"},
	}
	if diff := cmp.Diff(want, src.Tickets); diff != "" || src.Err != nil || src.More != 0 {
		t.Errorf("err %v, more %d, tickets (-want +got):\n%s", src.Err, src.More, diff)
	}
	if got.URL.Path != "/tasks/filter" || got.Header.Get("Authorization") != "Bearer "+token {
		t.Errorf("request = %s %v", got.URL.Path, got.Header)
	}
	if q := got.URL.Query(); q.Get("query") != "today | overdue" {
		t.Errorf("query = %v", q)
	}
}

func TestPullCapsAndCountsTheRest(t *testing.T) {
	var sb strings.Builder
	sb.WriteString(`{"results": [`)
	for i := 0; i < 60; i++ {
		if i > 0 {
			sb.WriteString(",")
		}
		sb.WriteString(`{"id": "x` + string(rune('A'+i%26)) + string(rune('a'+i/26)) + `", "content": "t", "priority": 1}`)
	}
	sb.WriteString(`], "next_cursor": null}`)
	td, _ := server(t, http.StatusOK, sb.String())
	src := pull(t, td)
	if len(src.Tickets) != maxTickets || src.More != 10 {
		t.Errorf("tickets %d, more %d", len(src.Tickets), src.More)
	}
}

func TestPullExplainsWhatWentWrongWithoutTheToken(t *testing.T) {
	cases := map[string]struct {
		status int
		body   string
		want   string
	}{
		"bad token":   {http.StatusUnauthorized, "", "Todoist rejected the token"},
		"forbidden":   {http.StatusForbidden, "", "Todoist rejected the token"},
		"bad filter":  {http.StatusBadRequest, "Invalid filter", "Todoist didn't accept the filter: Invalid filter"},
		"server down": {http.StatusInternalServerError, "", "Todoist answered 500"},
		"not json":    {http.StatusOK, "<html>", "couldn't read Todoist's answer"},
	}
	for name, c := range cases {
		t.Run(name, func(t *testing.T) {
			td, _ := server(t, c.status, c.body)
			src := pull(t, td)
			if src.Err == nil || src.Err.Error() != c.want || strings.Contains(src.Err.Error(), token) {
				t.Errorf("err = %v, want %q", src.Err, c.want)
			}
		})
	}
}

func TestPullUnreachable(t *testing.T) {
	td := New(nil)
	td.base = "http://127.0.0.1:1"
	src := pull(t, td)
	if src.Err == nil || src.Err.Error() != "Can't reach Todoist" {
		t.Errorf("err = %v", src.Err)
	}
}
