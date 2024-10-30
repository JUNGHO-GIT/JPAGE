// ImportContainers.tsx

import { lazy } from "@importReacts";

// -------------------------------------------------------------------------------------------------
const PopUp = lazy(() => import("@interfaces/containers/PopUp").then((module) => ({
  default: module.PopUp
})));
const Count = lazy(() => import("@interfaces/containers/Count").then((module) => ({
  default: module.Count
})));
const Delete = lazy(() => import("@interfaces/containers/Delete").then((module) => ({
  default: module.Delete
})));
const Memo = lazy(() => import("@interfaces/containers/Memo").then((module) => ({
  default: module.Memo
})));
const Select = lazy(() => import("@interfaces/containers/Select").then((module) => ({
  default: module.Select
})));
const TextArea = lazy(() => import("@interfaces/containers/TextArea").then((module) => ({
  default: module.TextArea
})));
const Input = lazy(() => import("@interfaces/containers/Input").then((module) => ({
  default: module.Input
})));
const InputFile = lazy(() => import("@interfaces/containers/InputFile").then((module) => ({
  default: module.InputFile
})));
const PickerTime = lazy(() => import("@interfaces/containers/PickerTime").then((module) => ({
  default: module.PickerTime
})));
const PickerDay = lazy(() => import("@interfaces/containers/PickerDay").then((module) => ({
  default: module.PickerDay
})));

// -------------------------------------------------------------------------------------------------
export {
  PopUp,
  Count,
  Delete,
  Memo,
  Select,
  TextArea,
  Input,
  InputFile,
  PickerTime,
  PickerDay,
};