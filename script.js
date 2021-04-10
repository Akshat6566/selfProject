require("chromedriver");
const wd=require("selenium-webdriver");
let fs=require("fs");
const path=require("path");
let browser=new wd.Builder().forBrowser('chrome').build();
async function main(){
    await browser.get("https://www.geeksforgeeks.org/");
    await browser.wait(wd.until.elementsLocated(wd.By.css("#hslider li a")));
    let topicWise=await browser.findElements(wd.By.css("#hslider li a"));
    let topicWiseHref=await topicWise[3].getAttribute("href");
    await browser.get(topicWiseHref);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".treeElements")));
    let showMore=await browser.findElements(wd.By.css("a[style='color:#4cb96b;text-shadow: 1px 1px #ccc;']"));
    let companyTag=await showMore[0].getAttribute("href");
    await browser.get(companyTag);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".well.table.whiteBgColor tr td a")));
    let companyUrl=await browser.findElements(wd.By.css(".well.table.whiteBgColor tr td a"));
    let companyName=[];
    let companyhref=[];
    for(let i in companyUrl){
        let chref=await companyUrl[i].getAttribute("href");
        let name=await companyUrl[i].getAttribute("innerText");
        companyName.push(name);
        companyhref.push(chref);
    }
    for(let i in companyName)
       console.log(i+". "+companyName[i]);
    let index;
    let cname;
    process.stdin.on('data',function(data){
       index=data.toString();    
       index=parseInt(index);
       cname=companyName[index];
       browser.get(companyhref[index]);
    })
    await browser.wait(wd.until.elementsLocated(wd.By.css(".panel.problem-block a[style='position: absolute;top: 0;left: 0;height: 100%;width: 100%;z-index:1;pointer:cursor;']")));
    let questionsUrl=await browser.findElements(wd.By.css(".panel.problem-block a[style='position: absolute;top: 0;left: 0;height: 100%;width: 100%;z-index:1;pointer:cursor;']"));
    await browser.wait(wd.until.elementsLocated(wd.By.css(".panel.problem-block div span[style='display:block;font-size: 20px !important']")));
    let questionName=await (await browser).findElements(wd.By.css(".panel.problem-block div span[style='display:block;font-size: 20px !important']"));
    let questionsHref=[];
    let questionsName=[];
    for(let i in questionsUrl){
        let url=await questionsUrl[i].getAttribute("href");
        questionsHref.push(url);
    }
    for(let i in questionName){
        let name=await questionName[i].getAttribute("innerText");
        questionsName.push(name);
    }
    filehandler(cname,questionsName,questionsHref);
}
main();

function filehandler(cname,questionsName,questionsHref){
    let dirPath=path.join(__dirname,cname);
    fs.mkdirSync(dirPath);
    var writeStream = fs.createWriteStream(`${cname}/file.xls`);
    var header="questions"+"\t\t\t"+"link"+"\n";
    writeStream.write(header);
    for(let i in questionsHref){
        var row=questionsName[i]+"\t"+questionsHref[i]+"\n";
        writeStream.write(row);
    }
    writeStream.close();
    
}
