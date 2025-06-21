import {http, HttpResponse} from 'msw'
import * as fs from 'fs'

export const handlers = [
    http.get('https://api.mockuser.com/users/:username/repos', ({params}) =>{
        const {username} = params;
        const jsonDataString = fs.readFileSync(`./static/mock-data/users/${username}/repos/data.JSON`, 'utf8')
        // console.log(JSON.parse(jsonDataString))
        return HttpResponse.json(JSON.parse(jsonDataString))
    }),
    http.get('https://api.mockuser.com/repos/:username/:repo/languages', ({params}) =>{
        const {username, repo} = params;
        // console.log(username, repo)
        const jsonDataString = fs.readFileSync(`./static/mock-data/repos/${username}/${repo}/languages/data.JSON`, 'utf8')
        // console.log(jsonDataString)
        return HttpResponse.json(JSON.parse(jsonDataString))
    })
]