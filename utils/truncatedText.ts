export function truncatedDesc(text:string, charLimit:number):string{
    if(text && charLimit >0){
        return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
    }else{
        return ''
    }
}