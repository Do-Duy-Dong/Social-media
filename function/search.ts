const search=(query: string): RegExp=>{
    const reg= new RegExp(query,"i");
    return  reg;
}
export default search;