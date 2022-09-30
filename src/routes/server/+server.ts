import { error } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export function POST(event: any) {
  console.log(event.request);
 
  const random = Math.random();
 
  return new Response(String(random));
}