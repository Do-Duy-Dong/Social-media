const fs= require("fs-extra");

const CopyFolder= [
    {
        sourceDir:'view',
        targetDir:"dist/view"
    },{
        sourceDir:'public',
        targetDir:"dist/public"
    }
]

CopyFolder.forEach(item=>{
    fs.copy(item.sourceDir,item.targetDir,(err)=>{
        if(err){
            console.log('Looix',item.sourceDir)
        }else{
            console.log('Finish');
        }
    })
})