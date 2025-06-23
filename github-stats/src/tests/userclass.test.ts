import { describe, test, expect } from 'vitest';
import { User } from '$lib/classes/user';
import type { projectLang, codingLang } from '$lib/types';

describe('User class', () => {
    test('initializes with correct username and empty languages', () => {
        const user = new User('testuser');
        expect(user.getLangs()).toEqual({});
        expect(user.getLangsArray()).toEqual([]);
    });

    test('addToLangs aggregates languages correctly', () => {
        const user = new User('testuser');
        const langs: projectLang[] = [
            { name: 'Python', lines: 100, percent: null },
            { name: 'JavaScript', lines: 50, percent: null },
            { name: 'Python', lines: 25, percent: null }
        ];
        user.addToLangs(langs);
        expect(user.getLangs()).toEqual({ Python: 125, JavaScript: 50 });
        const arr = user.getLangsArray();
        expect(arr).toContainEqual({ name: 'Python', lines: 125 });
        expect(arr).toContainEqual({ name: 'JavaScript', lines: 50 });
    });

    test('getLangsArray returns correct codingLang array', () => {
        const user = new User('testuser');
        user.addToLangs([
            { name: 'TypeScript', lines: 200, percent: null },
            { name: 'TypeScript', lines: 100, percent: null }
        ]);
        const arr = user.getLangsArray();
        expect(arr.length).toBe(1);
        expect(arr[0].name).toBe('TypeScript');
        expect(arr[0].lines).toBe(300);
    });

    test('addToLangs handles empty input', () => {
        const user = new User('testuser');
        user.addToLangs([]);
        expect(user.getLangs()).toEqual({});
        expect(user.getLangsArray()).toEqual([]);
    });
});
