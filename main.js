const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com";
let isGenresClick = false;
let page = 1;
let q = "";
let appid = "";
///
const displayGame = document.getElementById("add-game");
let displayGameName = document.getElementById("display-game-name");
let inputGenres = "";
/////....create genres function
const next = () => {
  page += 1;
  displayGame.innerHTML = "";
  renderGameOnScreen();
};
const prev = () => {
  page <= 1 ? (page = 1) : (page -= 1);
  // window.location.href = "index2.html";
  // if (page <= 1) page = 1;
  // if (page > 1) page -= 1;xs
  displayGame.innerHTML = "";
  renderGameOnScreen();
};
function genRes(parameterIn) {
  // console.log(parameterIn);
  displayGame.innerHTML = "";

  inputGenres = parameterIn;
  // console.log("inputGenres",typeof inputGenres);
  displayGameName.innerHTML = inputGenres.toUpperCase();
  // displayGameName.innerHTML = inputGenres.toString().toUpperCase();

  page = 1;
  q = "";
  isGenresClick = true;
  renderGameOnScreen();
}

////load more function
const loadMore = () => {
  page++;
  renderGameOnScreen();
};

////// search fucntion

const search = (event) => {
  event.preventDefault();
  displayGame.innerHTML = "";
  q = event.target[0].value;

  console.log("q", q);

  console.log("event", event.target[0].value);
  renderGameOnScreen();
};

///// Search game detail function
const getdetailGame = (appIdIn) => {
  appid = appIdIn;
  renderDetailGame();
  console.log(appid);
};

const getGenres = async () => {
  try {
    const { data } = await (await fetch(`${BASE_URL}/genres?limit=20`)).json();
    console.log("genres", data);

    // const genresName = data[0].name;
    // console.log("genresName", genresName);
    return data;
  } catch (error) {
    console.log(error);
  }
};
// getGenres();
const putGenres = document.getElementById("put-genres");
////

const renderGenres = async () => {
  try {
    const showGenres = await getGenres();

    showGenres.forEach((e, i) => {
      const genresLi = document.createElement("ul");
      genresLi.innerHTML = `<li type="none" onclick="genRes('${
        e.name
      }')" id="${e.name.replace(/\s+/g, "-").toLowerCase()}">${e.name}</li>`;
      putGenres.appendChild(genresLi);
    });
  } catch (error) {
    console.log(error);
  }
};
renderGenres();

///////
///

///
// const genRes = async (parameterIn) => {
//   if (parameterIn === "freetoplay") {
//     console.log("right condition");
//   }
//   const data = await getGenres();
// };
const getAllGames = async () => {
  try {
    const queryParameter = {
      genres: inputGenres,
      // limit: 15,
      // page: page
      page: page,
      q: q,
    };

    const userInput = Object.keys(queryParameter).reduce((acc, currentKey) => {
      if (queryParameter[currentKey]) {
        acc += `&${currentKey}=${queryParameter[currentKey]}`;
        console.log("acc", acc);
        console.log("queryParameter[]", queryParameter[currentKey]);
        return acc;
      }
      return acc;
    }, "limit=15");
    console.log("userinput", userInput);

    const { data } = await (
      await fetch(`${BASE_URL}/games?${userInput}`)
    ).json();

    console.log(data);
    return data;
  } catch (error) {
    console.log("er:", error);
  }
};

//////////
const renderGameOnScreen = async () => {
  try {
    const dataIn = await getAllGames();
    console.log("datain", dataIn);

    if (isGenresClick) {
      displayGame.innerHTML = "";
      isGenresClick = false;
    }
    dataIn.forEach((e, i) => {
      const dataLi = document.createElement("div");
      dataLi.className = "game-display";
      dataLi.setAttribute("onclick", `getdetailGame(${e.appid})`);
      dataLi.innerHTML = `
            <img id="image-game-id" style="height: auto; width: 350px;" src="${e.header_image}" alt="image of game" />
            <div class="name-of-the-game">
              <p class="game-name">
                ${e.name}
              </p>
              <p class="game-price">$${e.price}</p>`;
      displayGame.appendChild(dataLi);
    });
  } catch (error) {
    console.log("e", error);
  }
};
renderGameOnScreen();
/////
const getAPISingleGameDetail = async () => {
  const { data } = await (
    await fetch(`${BASE_URL}/single-game/${appid || ""}`)
  ).json();
  // console.log("data",data);
  return data;
};
// getAPISingleGameDetail();
const renderDetailGame = async () => {
  const gameRender = await getAPISingleGameDetail();
  console.log("game render", gameRender);
  console.log("game genres", gameRender.genres);
  const renderGame = document.createElement("div");
  renderGame.className = "detail-game-display";
  displayGameName.innerHTML = "DETAIL OF GAME";

  renderGame.innerHTML = `<div class="game-name">
  <h1 id="detail-game-name">${gameRender.name}</h1>
  <h2 id="detail-genres">${gameRender.genres[0]},${gameRender.genres[1]},${gameRender.genres[2]}</h2>
  <h3 id="detail-game-price">$${gameRender.price}</h3>
</div>s
<div class="gamevisual-container">
  <div class="game-visual-image-discription">
      <div class="game-visual-image">
          <img class="image-img" src="${gameRender.header_image}" alt="${gameRender.name}">
      </div>
      <div class="game-visual-discription">
          <p class="game-discription">${gameRender.description}</p>
          <p class="game-information">Game developer: ${gameRender.developer[0]}</p>
         
          <p class="game-information">requied Age : ${gameRender.required_age}</p>
          <p class="game-information">operating system :${gameRender.platforms}</p>     
      </div>
  </div>
</div>
<div class="taggame-name-container">
  <div>Popular user-defined tags for this product:</div>
  <div id = "taggame-name-container-list">
  </div>
</div>`;

  displayGame.innerHTML = "";
  displayGame.appendChild(renderGame);

  const tagnameContainer = document.getElementById(
    "taggame-name-container-list"
  );

  // console.log(gameRender.steamspy_tags);

  gameRender.steamspy_tags.forEach((e) => {
    const listOftag = document.createElement("div");
    listOftag.className = "list-of-tag";
    listOftag.innerHTML = `<li class="tagname-game" type="none">${e}</li>`;

    console.log(e);
    tagnameContainer.appendChild(listOftag);
  });
};
// renderDetailGame();
