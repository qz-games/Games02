import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const url = window.location.href;
const splitUrl = url.split("=");

const catInput = document.getElementById("selectCatImage");
const racketInput = document.getElementById("selectRacketImage");
const ballInput = document.getElementById("selectBallImage");
const backgroundInput = document.getElementById("selectBackgroundImage");
const playerRacketInput = document.getElementById("selectPlayerRacketImage");

const catImages = document.querySelectorAll(".catImage");
const racketImages = document.querySelectorAll(".racketImage");
const ballImages = document.querySelectorAll(".ballImage");
const backgroundImages = document.querySelectorAll(".backgroundImage");
const playerRacketImages = document.querySelectorAll(".playerRacketImage");
const randomButton = document.getElementById("randomButton");

let currentCatImage = "";
let currentBallImage = "";
let currentBackgroundImage = "";
let currentPlayerRacketImage = "";
let currentRacketImage = "";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
const firebaseConfig = {
  apiKey: "AIzaSyACaZ0Pxm5Ru3-gKxPizA2LtjnUYFhGcIc",
  authDomain: "cattennis-web.firebaseapp.com",
  projectId: "cattennis-web",
  storageBucket: "cattennis-web.appspot.com",
  messagingSenderId: "55163329321",
  appId: "1:55163329321:web:31eeebdf55f144a6d67538",
  measurementId: "G-WD90N0MV78",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

const randomString = generateRandomString(20);

const shareLink = `https://www.cattennisgame.com?games=${randomString}`;

if (splitUrl.length > 1) {
  const docRef = doc(db, "games", splitUrl[splitUrl.length - 1]);
  const targetDoc = await getDoc(docRef);
  const data = await targetDoc.data();
  if (data) {
    if (data.cat !== "") {
      catImages.forEach((image) => {
        image.style.backgroundImage = `url(${data.cat})`;
      });
    }
    if (data.ball !== "") {
      ballImages.forEach((image) => {
        image.style.backgroundImage = `url(${data.ball})`;
      });
    }
    if (data.catRacket !== "") {
      racketImages.forEach((image) => {
        image.style.backgroundImage = `url(${data.catRacket})`;
      });
    }
    if (data.myRacket !== "") {
      playerRacketImages.forEach((image) => {
        image.style.backgroundImage = `url(${data.myRacket})`;
      });
    }
    if (data.background !== "") {
      backgroundImages.forEach((image) => {
        image.style.backgroundImage = `url(${data.background})`;
      });
    }
  }
}

async function uploadImage(file) {
  try {
    const randomString2 = generateRandomString(21);
    const storageRef = ref(storage, "images/" + randomString2);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    history.replaceState({ state: "upload" }, " ", shareLink);
    return downloadURL;
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    throw error; // 오류를 다시 던져서 호출하는 쪽에서도 오류를 처리할 수 있도록 합니다.
  }
}

async function saveGameData() {
  const dbRef = collection(db, "games");
  await setDoc(doc(dbRef, randomString), {
    cat: currentCatImage || "",
    ball: currentBallImage || "",
    catRacket: currentRacketImage || "",
    myRacket: currentPlayerRacketImage || "",
    background: currentBackgroundImage || "",
    timestamp: new Date().getTime(),
  });
}

function onPressRandom() {
  gtag("event", "click random button");
  const ballImage = [
    "./ball1.png",
    "./ball2.png",
    "./ball3.png",
    "./meme_cat.png",
    "./meme_ball.png",
    "./brick.png",
    "./orange.png",
    "./banana-crying-cat.gif",
    "./troll.png",
    "./bitcoin.png",
  ];
  const catImage = [
    "./apple-cat.gif",
    "./meme_cat.png",
    "./roblox.png",
    "./orange.png",
    "./banana-crying-cat.gif",
    "./troll.png",
    "./meme_ball.png",
    "./doge.png",
  ];

  let randomCatImage = catImage[Math.floor(Math.random() * catImage.length)];
  currentCatImage = randomCatImage;

  let randomBallImage = ballImage[Math.floor(Math.random() * ballImage.length)];
  currentBallImage = randomBallImage;

  catImages.forEach((image) => {
    image.style.backgroundImage = `url(${randomCatImage})`;
  });

  ballImages.forEach((image) => {
    image.style.backgroundImage = `url(${randomBallImage})`;
  });
}

randomButton.addEventListener("click", onPressRandom);

catInput.addEventListener("change", async function (event) {
  gtag("event", "cat image change");
  const file = event.target.files[0];
  const options = {
    maxSizeMB: 1, // 허용하는 최대 사이즈 지정
    maxWidthOrHeight: 400, // 허용하는 최대 width, height 값 지정
    initialQuality: 0.8,
  };
  try {
    const compressedFile = file.type === "image/gif" ? file : await imageCompression(file, options);
    const imageUrl = URL.createObjectURL(compressedFile);

    catImages.forEach((image) => {
      image.style.backgroundImage = `url(${imageUrl})`;
    });

    const catImageUrl = await uploadImage(compressedFile);
    currentCatImage = catImageUrl;
    saveGameData();
    event.target.value = "";
  } catch (error) {
    console.error("이미지 리사이즈 오류:", error);
  }
});

racketInput.addEventListener("change", async function (event) {
  gtag("event", "racket image change");
  const file = event.target.files[0];
  const options = {
    maxSizeMB: 1, // 허용하는 최대 사이즈 지정
    maxWidthOrHeight: 400, // 허용하는 최대 width, height 값 지정
    initialQuality: 0.8,
  };
  try {
    const compressedFile = file.type === "image/gif" ? file : await imageCompression(file, options);
    const imageUrl = URL.createObjectURL(compressedFile);

    racketImages.forEach((image) => {
      image.style.backgroundImage = `url(${imageUrl})`;
    });

    const racketImageUrl = await uploadImage(compressedFile);
    currentRacketImage = racketImageUrl;
    saveGameData();
    event.target.value = "";
  } catch (error) {
    console.error("이미지 리사이즈 오류:", error);
  }
});

ballInput.addEventListener("change", async function (event) {
  gtag("event", "ball image change");
  const file = event.target.files[0];
  const options = {
    maxSizeMB: 1, // 허용하는 최대 사이즈 지정
    maxWidthOrHeight: 400, // 허용하는 최대 width, height 값 지정
    initialQuality: 0.8,
  };
  try {
    const compressedFile = file.type === "image/gif" ? file : await imageCompression(file, options);
    const imageUrl = URL.createObjectURL(compressedFile);

    ballImages.forEach((image) => {
      image.style.backgroundImage = `url(${imageUrl})`;
    });

    const ballImageUrl = await uploadImage(compressedFile);
    currentBallImage = ballImageUrl;
    saveGameData();
    event.target.value = "";
  } catch (error) {
    console.error("이미지 리사이즈 오류:", error);
  }
});

backgroundInput.addEventListener("change", async function (event) {
  gtag("event", "background image change");
  const file = event.target.files[0];
  const options = {
    maxSizeMB: 1, // 허용하는 최대 사이즈 지정
    maxWidthOrHeight: 400, // 허용하는 최대 width, height 값 지정
    initialQuality: 0.8,
  };
  try {
    const compressedFile = file.type === "image/gif" ? file : await imageCompression(file, options);
    const imageUrl = URL.createObjectURL(compressedFile);

    backgroundImages.forEach((image) => {
      image.style.backgroundImage = `url(${imageUrl})`;
    });

    const backgroundImageUrl = await uploadImage(resizedFile);
    currentBackgroundImage = backgroundImageUrl;
    saveGameData();
    event.target.value = "";
  } catch (error) {
    console.error("이미지 리사이즈 오류:", error);
  }
});

playerRacketInput.addEventListener("change", async function (event) {
  gtag("event", "player racket image change");
  const options = {
    maxSizeMB: 1, // 허용하는 최대 사이즈 지정
    maxWidthOrHeight: 400, // 허용하는 최대 width, height 값 지정
    initialQuality: 0.8,
  };
  try {
    const compressedFile = file.type === "image/gif" ? file : await imageCompression(file, options);
    const imageUrl = URL.createObjectURL(compressedFile);

    playerRacketImages.forEach((image) => {
      image.style.backgroundImage = `url(${imageUrl})`;
    });

    const playerRacketImageUrl = await uploadImage(resizedFile);
    currentPlayerRacketImage = playerRacketImageUrl;
    saveGameData();
    event.target.value = "";
  } catch (error) {
    console.error("이미지 리사이즈 오류:", error);
  }
});

function onClickShareButton() {
  gtag("event", "on Press Share button");

  const shareLink = `https://www.cattennisgame.com?games=${randomString}`;

  if (navigator.share) {
    // 모바일 브라우저에서는 웹 공유 API를 사용합니다.
    navigator
      .share({
        title: "Cat Tennis Game",
        text: "Make your own cat tennis game!",
        url: shareLink,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    // 데스크탑 브라우저에서는 클립보드 API를 사용합니다.
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareLink)
        .then(() => alert("Link copied to clipboard")) // Alert으로 변경된 부분
        .catch((error) => console.log("Error copying text: ", error));
    } else {
      console.log("Clipboard API not supported in your browser");
    }
  }
}

document.getElementById("shareButton1").addEventListener("touchstart", onClickShareButton);

document.getElementById("shareButton2").addEventListener("touchstart", onClickShareButton);

document.getElementById("shareButton1").addEventListener("click", onClickShareButton);

document.getElementById("shareButton2").addEventListener("click", onClickShareButton);

// function shareOnTwitter() {

//   window.open(twitterShareUrl, "_blank");
// }

function shareOnTwitter() {
  const text = encodeURIComponent("Play my tennis game! I’ve found the best website #cattennisgame");
  let twitterShareUrl = text + " " + encodeURIComponent(shareLink);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // iOS
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `twitter://post?message=${twitterShareUrl}`;
    }
    // Android
    else if (/Android/i.test(navigator.userAgent)) {
      window.location.href = `twitter://post?message=${twitterShareUrl}`;
    }
  } else {
    // Web version
    twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&url=` + encodeURIComponent(shareLink);
    window.open(twitterShareUrl, "_blank");
  }
}

document.getElementById("outerTwitterButton").addEventListener("click", shareOnTwitter);
document.getElementById("innerTwitterButton").addEventListener("click", shareOnTwitter);
