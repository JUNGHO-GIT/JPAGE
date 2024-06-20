// userService.js

import * as repository from "../../repository/user/userRepository.js";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {sendEmail} from "../../assets/js/email.js";
import {calendarArray} from '../../assets/array/calendarArray.js';
import {exerciseArray} from '../../assets/array/exerciseArray.js';
import {foodArray} from '../../assets/array/foodArray.js';
import {moneyArray} from '../../assets/array/moneyArray.js';
import {sleepArray} from '../../assets/array/sleepArray.js';

// 0-0. info ---------------------------------------------------------------------------------------
export const info = async (
  user_id_param
) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf-8'));

  const finalResult = {
    version: json.version || "",
    date: json.date || "",
    git: json.git || "",
    license: json.license || "",
  };

  return finalResult;
};

// 0-0. send ---------------------------------------------------------------------------------------
export const send = async (
  user_id_param
) => {

  // 임의의 코드 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const findResult = await sendEmail(
    user_id_param, code
  );

  const finalResult = {
    code: code,
    result: findResult
  };

  return finalResult;
};

// 0-0. signup -------------------------------------------------------------------------------------
export const signup = async (
  user_id_param, OBJECT_param
) => {

  const findResult = await repository.signup.checkId(
    user_id_param
  );

  let finalResult = null;
  if (findResult.length === 0) {
    finalResult = await repository.signup.signup(
      user_id_param, OBJECT_param
    );
  }
  else {
    finalResult = "duplicated";
  }

  return finalResult;
};

// 0-0. extra --------------------------------------------------------------------------------------
export const extra = async (
  user_id_param, OBJECT_param
) => {

  const findResult = await repository.extra.extra(
    user_id_param, OBJECT_param
  );

  let finalResult = null;
  if (findResult !== null) {
    finalResult = findResult;
  }
  else {
    finalResult = "fail";
  }

  return finalResult;
};

// 0-1. login --------------------------------------------------------------------------------------
export const login = async (
  user_id_param, user_pw_param
) => {

  const findResult = await repository.login.login(
    user_id_param, user_pw_param
  );

  let finalResult = null;
  if (findResult !== null) {
    finalResult = findResult;
  }
  else {
    finalResult = "fail";
  }

  return finalResult;
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = async (
  user_id_param, _id_param
) => {

  const finalResult = await repository.detail(
    user_id_param, _id_param
  );

  return finalResult
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param, OBJECT_param, DATE_param
) => {

  const findResult = await repository.save.detail(
    user_id_param, ""
  );

  let finalResult = null;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param
) => {

  const finalResult = await repository.deletes.deletes(
    user_id_param
  );

  return finalResult
};