import { http, HttpResponse } from 'msw'
import * as fs from 'fs'

// Mock handlers for user and repository data for testing purposes
export const handlers = [
    http.get('https://api.mockuser.com/users/:username/repos', ({ params }) => {
        const { username } = params;
        try {
            const jsonDataString = fs.readFileSync(`./static/mock-data/users/${username}/repos/data.JSON`, 'utf8');
            if (!jsonDataString) {
                return HttpResponse.json({ error: "Data not found" }, { status: 404 });
            }
            return HttpResponse.json(JSON.parse(jsonDataString), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
            return HttpResponse.json({ error: "Data not found" }, { status: 404 });
        }
    }),
    http.get('https://api.mockuser.com/repos/:username/:repo/languages', ({ params }) => {
        const { username, repo } = params;
        try {
            const jsonDataString = fs.readFileSync(`./static/mock-data/users/${username}/repos/${repo}/languages/data.JSON`, 'utf8');
            if (!jsonDataString) {
                return HttpResponse.json({ error: "Data not found" }, { status: 404 });
            }
            return HttpResponse.json(JSON.parse(jsonDataString), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
            return HttpResponse.json({ error: "Data not found" }, { status: 404 });
        }
    })
]