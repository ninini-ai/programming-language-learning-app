import { db } from "./firebase";
import {
 collection,
 getDocs
} from "firebase/firestore";

const cppTable =
document.getElementById("cppBoard");

const pythonTable =
document.getElementById("pythonBoard");

async function load(){

 const snap =
 await getDocs(
   collection(db,"users")
 );

 let users=[];

 snap.forEach(doc=>{

   users.push(doc.data());

 });

 const cpp =
 [...users]
 .sort(
  (a,b)=>
  (b.xp?.cpp||0)-
  (a.xp?.cpp||0)
 );

 const python =
 [...users]
 .sort(
  (a,b)=>
  (b.xp?.python||0)-
  (a.xp?.python||0)
 );

 cpp.forEach((u,i)=>{

   cppTable.innerHTML += `
   <tr>
    <td>${i+1}</td>
    <td>${u.name}</td>
    <td>${u.xp?.cpp||0}</td>
   </tr>
   `;
 });

 python.forEach((u,i)=>{

   pythonTable.innerHTML += `
   <tr>
    <td>${i+1}</td>
    <td>${u.name}</td>
    <td>${u.xp?.python||0}</td>
   </tr>
   `;
 });
}

load();