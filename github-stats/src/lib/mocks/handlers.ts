import {http, HttpResponse} from 'msw'

export const handlers = [
    http.get('https://api.mockuser.com/users/:username/repos', ({params}) =>{
        const {username} = params;
        console.log("username in api")
        return HttpResponse.json({
            id: '123-45fad6',
            firstName: username,
            lastName: 'rahh'
        })
    })
]