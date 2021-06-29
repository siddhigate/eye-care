const isLogged = true;

const onloaddash = () => {
    if(isLogged){
        document.querySelector(".signin").style.display = "none";
    }
    else{
        document.querySelector(".signout").style.display = "none";
    }
}