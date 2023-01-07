import React, {useEffect} from "react";

interface Props {
    document: Document | null
}

export function Template(props: Props) {
    useEffect(() => {
        console.log('The value of props is: ', props)
    }, [props])

    return (
        React.createElement('h1', null, 'Express + TypeScript Server + React Server Side Render')
    )
}
