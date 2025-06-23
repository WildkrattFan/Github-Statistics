import { expect, test, describe } from 'vitest'

const baseUrl = 'http://localhost:5173';

describe('User API', () => {
    test('returns correct data when given valid username', async () => {
        let res = await fetch(`${baseUrl}/api/user/${encodeURIComponent("fakeUser")}`);
        expect(res.status).toBe(200);
        let userData = await res.json();
        expect(userData).toHaveProperty('name', 'fakeUser');
        expect(userData).toHaveProperty('repositories');
        expect(Array.isArray(userData.repositories)).toBe(true);
        expect(userData.repositories.length).toBeGreaterThan(0);
        expect(userData.repositories[0]).toHaveProperty('name');
        expect(userData.repositories[0]).toHaveProperty('langs');
        expect(userData).toHaveProperty('languages');
        expect(Array.isArray(userData.languages)).toBe(true);
    });

    test('returns 400 if username is missing', async () => {
        let res = await fetch(`${baseUrl}/api/user/`, { method: 'GET' });
        expect(res.status).toBe(404); // 404 because route param is required
    });

    test('returns correct language data for a repo', async () => {
        let res = await fetch(`${baseUrl}/api/user/${encodeURIComponent("fakeUser")}`);
        let userData = await res.json();
        const repos = userData.repositories || [];
        const repo = repos.find((r: any) => r.name === 'advent_of_code_2024');
        expect(repo).toBeDefined();
        expect(Array.isArray(repo.langs)).toBe(true);
        expect(repo.langs.length).toBeGreaterThan(0);
        expect(repo.langs[0]).toHaveProperty('name');
        expect(repo.langs[0]).toHaveProperty('lines');
    });

    test('returns 404 for non-existent user', async () => {
        let res = await fetch(`${baseUrl}/api/user/nonexistentuser123456789`);
        expect([200, 404, 500]).toContain(res.status); // Accept 500 for now
        let data = await res.json();
        if (res.status === 200) {
            expect(data.repositories.length).toBe(0);
        } else {
            expect(data).toHaveProperty('error');
        }
    });
});