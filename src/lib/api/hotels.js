// const res = fetch("http://localhost:8000/api/hotels", { //in here we are getting the response only we are not getting the body
//     method: "GET",
// })
// res.then((body) => { //then handles fulfilled stage
//     console.log(body);
//     return body.json();
// }).then((data)=>{
//     console.log(data);
// })
// .catch((err) => {
//     console.log(err); //catch handles rejected state
// });
export const getHotels=async() =>{
    const res = await fetch("http://localhost:8000/api/hotels", { //in here we are getting the response only we are not getting the body
        method: "GET",
    });
    if(!res.ok){
        throw new Error("Failed to fetch hotels");
    }
    const data = await res.json();
    return data;
};