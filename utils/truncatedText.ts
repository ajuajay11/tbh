export function truncatedDesc(text:string, charLimit:number):string{
    if(text && charLimit >0){
        return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
    }else{
        return ''
    }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime(); // no need for Math.abs, as we assume date is in the past

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString(); // fallback to local format for older dates
}
