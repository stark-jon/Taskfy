const signUpError=document.querySelector("#signup-error"),signUpForm=document.querySelector("#signUpForm"),loginError=document.querySelector("#login-error"),loginForm=document.querySelector("#loginForm"),logoutUser=document.querySelector("#logout"),logoutUserAll=document.querySelector("#logoutAll"),isAuth=document.querySelector("#isAuth");if(window.onload=(()=>{fetch("/users/isAuth",{method:"POST"}).then(e=>e.json()).then(e=>{e.isAuth&&!isAuth?location.href="/tasks":!e.isAuth&&isAuth&&location.reload()})}),signUpForm&&signUpForm.addEventListener("submit",e=>{signUpError.innerHTML="",signUpError.style="color:#e6402b;font-size:12px;text-align:center;",e.preventDefault();const t=new FormData(signUpForm);if(t.get("password-confirm")!==t.get("password"))return void(signUpError.innerHTML="pasword do not match!");const o={name:t.get("name"),email:t.get("email"),password:t.get("password")};fetch("/users/",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(e=>e.json()).then(e=>{"User Created, Please Login!"===e.message&&(signUpError.style.color="#55c57a",setTimeout(()=>{location.href="/login"})),e.message&&(signUpError.innerHTML=e.message)}).catch(e=>{signUpError.innerHTML=e})}),loginForm&&loginForm.addEventListener("submit",e=>{loginError.innerHTML="",loginError.style="color:#e6402b;font-size:12px;text-align:center;",e.preventDefault();const t=new FormData(loginForm),o={email:t.get("email"),password:t.get("password")};fetch("/users/login",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(e=>e.json()).then(e=>{"logged in!"===e.message&&(localStorage.setItem("userID",e.id),loginError.style.color="#55c57a",setTimeout(()=>{location.href="/tasks"})),e.message&&(loginError.innerHTML=e.message)}).catch(e=>{loginError.innerHTML=e})}),logoutUser&&logoutUser.addEventListener("click",e=>{e.preventDefault(),fetch("/users/logout",{method:"POST"}).then(e=>e.json()).then(e=>{e.logout&&(localStorage.clear(),location.reload())}).catch(e=>{location="/tasks"})}),logoutUserAll&&logoutUserAll.addEventListener("click",e=>{e.preventDefault(),fetch("/users/logout/all",{method:"POST"}).then(e=>e.json()).then(e=>{e.logout&&(localStorage.clear(),location.reload())}).catch(e=>{location="/tasks"})}),isAuth){const e=document.querySelector("#updateForm"),t=document.querySelector("#deleteUser"),o=document.querySelector("#updateInfo"),n=document.querySelector("#deleteInfo");e&&e.addEventListener("submit",t=>{t.preventDefault();const n=new FormData(e),r={name:n.get("name"),password:n.get("password")};fetch("/users",{method:"PUT",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}).then(e=>e.json()).then(e=>{o.style="color:#55c57a;font-size:12px;text-align:center;",o.innerHTML="updated!",setTimeout(()=>{o.innerHTML=""},1e3),setTimeout(()=>{location.href="/tasks"},1500)}).catch(e=>{o.style="color:#e6402b;font-size:12px;text-align:center;",o.innerHTML="can't update!"})}),t&&t.addEventListener("submit",e=>{n.innerHTML="",e.preventDefault();const o={password:new FormData(t).get("password")};fetch("/users",{method:"DELETE",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(e=>e.json()).then(e=>{n.style="color:#4dc8ef;font-size:12px;text-align:center;","deleted!"===e.message&&(n.innerHTML=e.message,location.reload()),n.innerHTML=e.message}).catch(e=>{n.style="color:#e6402b;font-size:12px;text-align:center;",n.innerHTML="can't update!"})})}