import { Position, Toaster } from "@blueprintjs/core";

export const BoardToaster = Toaster.create({
    className: "BoardToaster-toaster",
    position: Position.BOTTOM_RIGHT,
});