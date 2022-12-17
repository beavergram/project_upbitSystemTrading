import jwt from "jsonwebtoken";
import request from "request";
import fetch from "node-fetch";
// import fetch from "node-fetch-retry";
import uuidv4 from "uuid/v4.js";
import crypto from "crypto";
import sign from "jsonwebtoken";
import queryEncode from "querystring";

const a_key = "access";
const s_key = "secret";

const server_url = "https://api.upbit.com";
const coinList = { "KRW-BTC": 500000, "KRW-ETH": 500000, "KRW-ATOM": 500000 };

const minCandle = 5; // 분봉 조회 기준 시간

////////////////////////////////////////////////////////////
// Sleep function
////////////////////////////////////////////////////////////
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const delaySleep = async (delayTime) => {
  await sleep(delayTime);
  // console.log('Do something...')
};

////////////////////////////////////////////////////////////
// EXCHANGE API
////////////////////////////////////////////////////////////

/////////////////////////////
// 계좌 조회
/////////////////////////////
async function getAccounts() {
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
  };
  const token = sign.sign(payload, s_key);
  const options = {
    method: "GET",
    timeout: 10000,
    url: server_url + "/v1/accounts",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

/////////////////////////////
// 지정가 매수 주문
/////////////////////////////
async function postBuyLimitOrder(coinName, orderVol, orderPrice) {
  const market = coinName;
  const volume = orderVol;
  const price = orderPrice;
  const body = {
    market: market,
    side: "bid",
    volume: volume,
    price: price,
    ord_type: "limit",
  };

  const query = queryEncode.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, s_key);

  const options = {
    method: "POST",
    timeout: 10000,
    url: server_url + "/v1/orders?" + query,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    json: body,
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

/////////////////////////////
// 지정가 매도 주문
/////////////////////////////
async function postSellLimitOrder(coinName, orderVol, coinPrice) {
  const market = coinName;
  const volume = orderVol;
  const price = coinPrice;
  const body = {
    market: market,
    side: "ask",
    volume: volume,
    price: price,
    ord_type: "limit",
  };

  const query = queryEncode.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, s_key);

  const options = {
    method: "POST",
    timeout: 10000,
    url: server_url + "/v1/orders?" + query,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    json: body,
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

/////////////////////////////
// 시장가 매수 주문
/////////////////////////////
async function postBuyMarketOrder(coinName, orderPrice) {
  const market = coinName;
  const price = orderPrice;
  const body = {
    market: market,
    side: "bid",
    price: price,
    ord_type: "price",
  };

  const query = queryEncode.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, s_key);

  const options = {
    method: "POST",
    timeout: 10000,
    url: server_url + "/v1/orders?" + query,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    json: body,
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

/////////////////////////////
// 시장가 매도 주문
/////////////////////////////
async function postSellMarketOrder(coinName, orderVol) {
  const market = coinName;
  const volume = orderVol;
  const body = {
    market: market,
    side: "ask",
    volume: volume,
    ord_type: "market",
  };

  const query = queryEncode.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, s_key);

  const options = {
    method: "POST",
    timeout: 10000,
    url: server_url + "/v1/orders?" + query,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    json: body,
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

/////////////////////////////
// 코인별 대기주문 조회(주문 리스트 조회)
/////////////////////////////
async function getOrderList(coinName) {
  const state = "wait";
  const market = coinName;
  const limit = 10;
  const uuids = [];
  const non_array_body = {
    state: state,
    market: market,
    limit: limit,
  };
  const array_body = {
    uuids: uuids,
  };
  const body = {
    ...non_array_body,
    ...array_body,
  };
  // const uuid_query = uuids.map((uuid) => `uuids[]=${uuid}`).join("&");

  const query = queryEncode.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, s_key);

  const options = {
    method: "GET",
    timeout: 10000,
    url: server_url + "/v1/orders?" + query,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    json: body,
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

/////////////////////////////
// uuid별 주문 조회(개별 주문 조회)
/////////////////////////////
async function getOrder(orderUuid) {
  const uuid = orderUuid;
  const body = {
    uuid: uuid,
  };
  // const uuid_query = uuids.map((uuid) => `uuids[]=${uuid}`).join("&");

  const query = queryEncode.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, s_key);

  const options = {
    method: "GET",
    timeout: 10000,
    url: server_url + "/v1/orders?" + query,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    json: body,
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

/////////////////////////////
// 개별 대기주문 취소
/////////////////////////////
async function deleteOrder(orderUuid) {
  const uuid = orderUuid;
  const body = {
    uuid: orderUuid,
  };
  // const uuid_query = uuids.map((uuid) => `uuids[]=${uuid}`).join("&");

  const query = queryEncode.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: a_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, s_key);

  const options = {
    method: "DELETE",
    url: server_url + "/v1/order?" + query,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    json: body,
  };
  return new Promise((resolve) => {
    try {
      request(options, (error, response, body) => {
        // if (error) throw new Error(error);
        // console.log(body);
        resolve(body);
      });
    } catch {
      console.log("에러", error);
    }
  });
}

////////////////////////////////////////////////////////////
// QUOTATION API
////////////////////////////////////////////////////////////

/////////////////////////////
// 분봉 조회
/////////////////////////////
async function getMinuteCandle(minCandle, coinName) {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    retry: 3,
  };
  let response = fetch(
    `https://api.upbit.com/v1/candles/minutes/${minCandle}?market=${coinName}&count=200`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
  return response;
}

/////////////////////////////
// 일봉 조회
/////////////////////////////
async function getDayCandle(coinName) {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    retry: 3,
  };
  let response = fetch(
    `https://api.upbit.com/v1/candles/days?market=${coinName}&count=200`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
  return response;
}

/////////////////////////////
// 호가정보(오더북) 조회
/////////////////////////////
async function getOrderbook(coinName) {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    retry: 3,
  };
  let response = fetch(
    `https://api.upbit.com/v1/orderbook?markets=${coinName}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      // console.log(response[0].orderbook_units[0][ask_price]);
      // console.log(response[0].orderbook_units[0][bid_price]);

      return response;
    })
    .catch((err) => console.error(err));
  return response;
}

/////////////////////////////
// 현재가 조회
/////////////////////////////
async function getCurrPrice(coinName) {
  const options = {
    method: "GET",
    headers: { Accept: "application/json" },
    retry: 3,
  };
  let response = fetch(
    `https://api.upbit.com/v1/ticker?markets=${coinName}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
  return response;
}

/////////////////////////////
// 틱사이즈 계산
/////////////////////////////
function getTickSize(price) {
  let tickSize = 0;
  if (price >= 2000000) tickSize = Math.round(price / 1000) * 1000;
  else if (price >= 1000000) tickSize = Math.round(price / 500) * 500;
  else if (price >= 500000) tickSize = Math.round(price / 100) * 100;
  else if (price >= 100000) tickSize = Math.round(price / 50) * 50;
  else if (price >= 10000) tickSize = Math.round(price / 10) * 10;
  else if (price >= 1000) tickSize = Math.round(price / 5) * 5;
  else if (price >= 100) tickSize = Math.round(price / 1) * 1;
  else if (price >= 10) tickSize = Math.round(price / 0.1) / 10;
  else tickSize = Math.round(price / 0.01) / 100;
  return tickSize;
}

/////////////////////////////
// 루프 함수
/////////////////////////////
async function loop() {
  try {
    // let start = new Date();
    let today = new Date();
    today = today.toLocaleString();
    let resAccounts = new Array();
    let thisCoinCurrPrice = new Array();
    let resOrderList = new Array();

    resAccounts = await getAccounts(); // 계좌 정보 받기
    resAccounts = JSON.parse(resAccounts); // JSON 문자열 => Javascript 객체로 변환

    for (var i in resAccounts) {
      let thisCoinName = `${resAccounts[i]["unit_currency"]}-${resAccounts[i]["currency"]}`; // 보유중인 코인 이름(ex: BTC)을 주문 형식의 이름(ex: KRW-BTC)으로 변환
      let isIncludeCoinList = Object.keys(coinList).includes(thisCoinName); // thisCoinName이 CoinList Key에 포함되어 있는지 확인
      if (!isIncludeCoinList) continue; // 포함되어 있지 않다면 continue

      let thisCoinAmount =
        parseFloat(resAccounts[i]["balance"]) +
        parseFloat(resAccounts[i]["locked"]); // thisCoin의 코인 개수

      thisCoinCurrPrice = await getCurrPrice(thisCoinName); // thisCoin의 현재 가격

      if (thisCoinCurrPrice == undefined) continue;
      thisCoinCurrPrice = parseFloat(thisCoinCurrPrice[0]["trade_price"]); // str => float 변환
      let thisCoinCurrAvgAmount = Math.floor(
        thisCoinAmount * thisCoinCurrPrice
      ); // thisCoin의 현재 평가 금액

      //////////////////////////////////////////////////////
      // 프로세스 출력
      //////////////////////////////////////////////////////

      console.log(
        `${today} > ${thisCoinName} : ${thisCoinCurrAvgAmount.toLocaleString(
          "ko-KR"
        )} KRW`
      ); // 코인 : 현재 평가금 출력

      //////////////////////////////////////////////////////

      resOrderList = await getOrderList(thisCoinName); // thisCoin의 대기 주문 조회
      let numBidOrder = 0; // 대기 매수주문 개수
      let numAskOrder = 0; // 대기 매도주문 개수
      for (var j in resOrderList) {
        if (resOrderList[j]["side"] == "bid") numBidOrder = numBidOrder + 1;
        else numAskOrder = numAskOrder + 1;
      }
      const numTotalOrder = Object.keys(resOrderList).length;
      // if (numTotalOrder < 2) {

      if (thisCoinCurrAvgAmount < coinList[thisCoinName] * 0.989) {
        // 커트라인 이하일 때(시장가 매수)
        for (var k in resOrderList) {
          if (resOrderList[k]["side"] == "bid") {
            await deleteOrder(resOrderList[k]["uuid"]);
            console.log(`${today} > ${thisCoinName} : 매수 주문 취소`);
          } else if (resOrderList[k]["side"] == "ask") {
            await deleteOrder(resOrderList[k]["uuid"]);
            console.log(`${today} > ${thisCoinName} : 매도 주문 취소`);
          }
        }
        await postBuyMarketOrder(
          thisCoinName,
          coinList[thisCoinName] - thisCoinCurrAvgAmount
        ); // 시장가 매수 주문
        console.log(`${today} > ${thisCoinName} : 시장가 매수 주문 완료`);
        continue;
      }
      if (thisCoinCurrAvgAmount > coinList[thisCoinName] * 1.011) {
        // 커트라인 이상일 때(시장가 매도)
        for (var k in resOrderList) {
          if (resOrderList[k]["side"] == "bid") {
            await deleteOrder(resOrderList[k]["uuid"]);
            console.log(`${today} > ${thisCoinName} : 매수 주문 취소`);
          } else if (resOrderList[k]["side"] == "ask") {
            await deleteOrder(resOrderList[k]["uuid"]);
            console.log(`${today} > ${thisCoinName} : 매도 주문 취소`);
          }
        }
        let orderBookBidPrice = await getOrderbook(thisCoinName);
        orderBookBidPrice =
          orderBookBidPrice[0].orderbook_units[0]["bid_price"]; // 1호가 매수 가격
        let orderPrice = thisCoinCurrAvgAmount - coinList[thisCoinName]; // 초과 평가금액
        if (orderPrice < 5001) orderPrice = 5001;
        let orderVol =
          Math.round((orderPrice / orderBookBidPrice) * Math.pow(10, 8)) /
          Math.pow(10, 8); // 매도 볼륨 계산(소수점 8번째 자리까지 표시)

        await postSellMarketOrder(thisCoinName, orderVol); // 시장가 매도 주문
        console.log(`${today} > ${thisCoinName} : 시장가 매도 주문 완료`);
        continue;
      }

      // 둘 중 한개가 체결되거나 주문이 비워져 있으면 전체 주문 취소
      if (numBidOrder != 1 || numAskOrder != 1) {
        for (var k in resOrderList) {
          if (resOrderList[k]["side"] == "bid") {
            await deleteOrder(resOrderList[k]["uuid"]);
            console.log(`${today} > ${thisCoinName} : 매수 주문 취소`);
          } else if (resOrderList[k]["side"] == "ask") {
            await deleteOrder(resOrderList[k]["uuid"]);
            console.log(`${today} > ${thisCoinName} : 매도 주문 취소`);
          }
        }

        resOrderList = await getOrderList(thisCoinName); // thisCoin의 대기 주문 조회
        let numBidOrder = 0; // 대기 매수주문 개수
        let numAskOrder = 0; // 대기 매도주문 개수
        for (var j in resOrderList) {
          if (resOrderList[j]["side"] == "bid") numBidOrder = numBidOrder + 1;
          else numAskOrder = numAskOrder + 1;
        }

        if (numBidOrder == 0) {
          // if (thisCoinCurrAvgAmount >= coinList[thisCoinName] * 0.99) {
          // 커트라인 이상일 때(지정가 매수)
          let targetBidPrice =
            (coinList[thisCoinName] * 0.99 * thisCoinCurrPrice) /
            thisCoinCurrAvgAmount; // 매수 주문 가격 계산
          targetBidPrice = getTickSize(targetBidPrice); // 틱사이즈 변환

          let orderPrice = coinList[thisCoinName] * 0.01; // 매수 금액 계산
          if (orderPrice < 5001) orderPrice = 5001;
          let orderVol =
            Math.round((orderPrice / targetBidPrice) * Math.pow(10, 8)) /
            Math.pow(10, 8); // 매수 볼륨 계산(소수점 8번째 자리까지 표시)
          await postBuyLimitOrder(thisCoinName, orderVol, targetBidPrice); // 지정가 매수 주문
          console.log(`${today} > ${thisCoinName} : 지정가 매수 주문 완료`);
          // }
        }
        if (numAskOrder == 0) {
          // if (thisCoinCurrAvgAmount <= coinList[thisCoinName] * 1.01) {
          // 커트라인 이하일 때(지정가 매도)
          let targetAskPrice =
            (coinList[thisCoinName] * 1.01 * thisCoinCurrPrice) /
            thisCoinCurrAvgAmount; // 매도 주문 가격 계산
          targetAskPrice = getTickSize(targetAskPrice); // 틱사이즈 변환

          let orderPrice = coinList[thisCoinName] * 0.01; // 매도 금액 계산
          if (orderPrice < 5001) orderPrice = 5001;
          let orderVol =
            Math.round((orderPrice / targetAskPrice) * Math.pow(10, 8)) /
            Math.pow(10, 8); // 매도 볼륨 계산(소수점 8번째 자리까지 표시)
          console.log(`${today} > ${thisCoinName} : 지정가 매도 주문 완료`);
          await postSellLimitOrder(thisCoinName, orderVol, targetAskPrice); // 지정가 매수 주문
          // }
        }
      }

      /*       if (numBidOrder == 0) {
        // if (thisCoinCurrAvgAmount >= coinList[thisCoinName] * 0.99) {
        // 커트라인 이상일 때(지정가 매수)
        let targetBidPrice =
          (coinList[thisCoinName] * 0.99 * thisCoinCurrPrice) /
          thisCoinCurrAvgAmount; // 매수 주문 가격 계산
        targetBidPrice = getTickSize(targetBidPrice); // 틱사이즈 변환

        let orderPrice = coinList[thisCoinName] * 0.01; // 매수 금액 계산
        if (orderPrice < 5001) orderPrice = 5001;
        let orderVol =
          Math.round((orderPrice / targetBidPrice) * Math.pow(10, 8)) /
          Math.pow(10, 8); // 매수 볼륨 계산(소수점 8번째 자리까지 표시)
        await postBuyLimitOrder(thisCoinName, orderVol, targetBidPrice); // 지정가 매수 주문
        console.log(`${today} > ${thisCoinName} : 지정가 매수 주문 완료`);
        // }
      }
      if (numAskOrder == 0) {
        // if (thisCoinCurrAvgAmount <= coinList[thisCoinName] * 1.01) {
        // 커트라인 이하일 때(지정가 매도)
        let targetAskPrice =
          (coinList[thisCoinName] * 1.01 * thisCoinCurrPrice) /
          thisCoinCurrAvgAmount; // 매도 주문 가격 계산
        targetAskPrice = getTickSize(targetAskPrice); // 틱사이즈 변환

        let orderPrice = coinList[thisCoinName] * 0.01; // 매도 금액 계산
        if (orderPrice < 5001) orderPrice = 5001;
        let orderVol =
          Math.round((orderPrice / targetAskPrice) * Math.pow(10, 8)) /
          Math.pow(10, 8); // 매도 볼륨 계산(소수점 8번째 자리까지 표시)
        console.log(`${today} > ${thisCoinName} : 지정가 매도 주문 완료`);
        await postSellLimitOrder(thisCoinName, orderVol, targetAskPrice); // 지정가 매수 주문
        // }
      } */
      await delaySleep(100);
    }
  } catch {
    let today = new Date();
    today = today.toLocaleString();
    console.log(`${today} > Loop Error`);
  }

  // await delaySleep(1000);
}

// let end = new Date();
// console.log(`1loop runtime : ${end - start}`);

// loop();

setInterval(() => {
  loop();
}, 1000);
