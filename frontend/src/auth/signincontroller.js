const email = document.querySelector("#email-signin");
const password = document.querySelector("#password-signin");
const signinbtn = document.querySelector("#btn-signin");
const signoutlink = document.querySelector(".signout");
const signin_form = document.querySelector("#signinform");

signinbtn.addEventListener("click", () => {
    console.log(email.value);
    console.log(password.value)
    if(email.value === password.value){
        signin_form.action = "../../index.html";
    }
    else{
        signin_form.action="./signinpage.html";
    }
})


/** ONLOADING */
const signinonload = () => {
    signoutlink.style.display = "none";

}