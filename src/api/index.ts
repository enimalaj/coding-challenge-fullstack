import axios from 'axios'
import {API_URL} from "../constants"

export const getImages = async({queryKey}:any)=>{
console.log(queryKey)
  let result=await axios.get(`https://api.imgur.com/3/gallery/${queryKey[2]}/${queryKey[3]}/${queryKey[4]}/${queryKey[1]}?album_previews=false`);
  return result?.data?.data
}
