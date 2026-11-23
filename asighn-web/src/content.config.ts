import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

// Cada colección valida su esquema: si a una ficha le falta un campo, el sitio no compila (implementation.md, Plataforma).

const cifras = defineCollection({
  loader: file('src/content/cifras.json'),
  schema: z.object({
    indicador: z.string(),
    valor: z.number(),
    unidad: z.string(),
    corte: z.string(),
    nota: z.string().optional(),
  }),
});

const servicios = defineCollection({
  loader: file('src/content/servicios.json'),
  schema: z.object({
    orden: z.number(),
    titulo: z.string(),
    frase: z.string(),
    entregable: z.string(),
    slug: z.string(),
    foto: z.string(),
    imagen: z.string().optional(),
  }),
});

// Casos anónimos. Un campo vacío se muestra como pendiente en la vista previa; nada se inventa.
const casos = defineCollection({
  loader: file('src/content/casos.json'),
  schema: z.object({
    orden: z.number(),
    destacado: z.boolean(),
    sector: z.string(),
    problema: z.string(),
    intervencion: z.string(),
    resultado: z.string(),
    instrumento: z.string(),
    aprobado: z.boolean(),
  }),
});

const articulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/articulos' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    resumen: z.string(),
    portada: z.string(),
    autor: z.string().optional(),
    minutos: z.number().optional(),
    urlWix: z.string().optional(),
    rescatado: z.boolean().default(false),
    descarga: z.string().optional(),
  }),
});

export const collections = { cifras, servicios, casos, articulos };
