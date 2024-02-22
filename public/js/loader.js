
const loaderBG =document.querySelector(".loader-wrapper")
const pageContent=document.querySelector(".page-content");


window.addEventListener('load',()=>{
    loaderBG.classList.add("hiddened")
    pageContent.classList.add("visible")
})