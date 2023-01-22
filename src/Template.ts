import React, {useEffect} from "react";

export function Template() {
    useEffect(() => {
        console.log('Server Side Rendering')
    }, [])

    return (
        React.createElement('html', {
            children: [
                React.createElement('head', {
                    children: [
                        React.createElement('meta', {
                            charSet: 'utf-8'
                        }),
                        React.createElement('meta', {
                            name: "viewport",
                            content: "width=device-width, initial-scale=1",
                        }),
                        React.createElement('link', {
                            rel: "stylesheet",
                            href: "styles.css"
                        }),
                        React.createElement('title', {}, 'SSR React')
                    ]
                }),
                React.createElement('body', {
                    children: [React.createElement('h1', null, 'Express + TypeScript Server + React Server Side Render')]
                })]
        })
    )
}
