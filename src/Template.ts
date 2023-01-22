import React, {useEffect} from "react";

export function Template() {
    useEffect(() => {
        console.log('Server Side Rendering')
    }, [])

    return (
        React.createElement('h1', null, 'Express + TypeScript Server + React Server Side Render')
    )
}
