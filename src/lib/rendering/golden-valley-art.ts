export const paintingWidth = 600;
export const paintingHeight = 740;

export function drawGoldenValley(ctx: CanvasRenderingContext2D) {
  function shape(color: string, path: string) {
    ctx.fillStyle = color;
    ctx.fill(new Path2D(path));
  }

  const sky = ctx.createLinearGradient(0, 0, 0, 375);
  sky.addColorStop(0, "#f5ead6");
  sky.addColorStop(1, "#fff7dc");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, paintingWidth, paintingHeight);

  ctx.fillStyle = "#e7c67e";
  ctx.beginPath();
  ctx.arc(419, 152, 38, 0, Math.PI * 2);
  ctx.fill();

  shape(
    "#ead8d3",
    "M42 149 Q93 137 118 139 Q146 124 185 143 Q202 144 227 150 Q134 160 42 149Z",
  );
  shape(
    "#edddd6",
    "M337 222 Q385 205 418 210 Q446 197 486 215 Q512 214 556 224 Q472 231 337 222Z",
  );
  shape(
    "#c7c7d1",
    "M0 331 C50 314 78 272 124 279 S190 317 229 296 S286 254 329 282 S392 325 432 308 S493 270 524 290 S570 321 600 312 V740 H0Z",
  );
  shape(
    "#b3c0cb",
    "M0 352 C83 322 137 337 203 323 S278 310 337 339 S413 345 465 329 S541 324 600 348 V740 H0Z",
  );
  shape(
    "#a5b9b8",
    "M0 375 Q79 341 162 362 T309 359 T459 369 T600 355 V740 H0Z",
  );
  shape(
    "#b7c09b",
    "M0 403 C102 364 161 398 230 405 C320 417 346 375 439 390 S538 420 600 384 V740 H0Z",
  );
  shape("#9bac88", "M0 430 C115 393 178 465 296 431 S446 429 600 410 V740 H0Z");
  shape(
    "#829e87",
    "M600 441 C482 419 473 481 370 482 S205 481 171 572 L600 626Z",
  );
  shape(
    "#889d75",
    "M0 491 C116 449 146 530 275 519 C309 543 286 564 252 596 L0 659Z",
  );
  shape(
    "#dcd7a5",
    "M600 525 C530 527 492 515 433 527 S341 550 325 582 Q428 626 600 568Z",
  );
  shape(
    "#a4ad7d",
    "M600 565 C485 549 464 647 355 609 C454 677 528 627 600 665Z",
  );
  shape(
    "#9fae83",
    "M0 528 C72 505 101 524 166 549 S239 570 285 564 L266 594 C155 616 118 550 0 573Z",
  );

  shape(
    "#b2cdd0",
    "M388 418 C449 458 360 479 321 514 C254 576 340 601 373 634 C414 670 418 709 486 740 H162 C182 684 254 645 266 609 C278 572 225 562 276 516 C320 476 416 452 377 420Z",
  );
  shape(
    "#d1e1db",
    "M380 418 C431 453 348 483 309 518 C270 552 309 575 327 586 C282 574 253 551 297 518 C340 480 415 451 374 419Z",
  );
  shape(
    "#99bec6",
    "M289 590 C310 616 358 627 390 666 C416 698 424 727 450 740 H396 C365 692 345 651 311 629 Q292 616 289 590Z",
  );

  shape(
    "#718963",
    "M0 626 C104 603 159 650 231 671 C336 705 412 694 477 669 Q544 647 600 683 V740 H0Z",
  );
  shape(
    "#5e7d64",
    "M0 682 Q79 635 173 680 T339 718 Q411 720 478 693 Q552 667 600 707 V740 H0Z",
  );
  shape("#879973", "M0 725 Q82 684 176 716 Q257 754 346 733 T600 728 V740 H0Z");

  for (const [x, base, size, color] of [
    [102, 486, 101, "#547163"],
    [139, 507, 142, "#41665a"],
    [175, 525, 111, "#557864"],
  ] as const) {
    ctx.fillStyle = "#756f51";
    ctx.fillRect(x - 2, base - size / 3, 4, size / 3);
    shape(
      color,
      `M${x} ${base - size} Q${x - 32} ${base - 30} ${x} ${base - 15} Q${x + 29} ${base - 24} ${x} ${base - size}Z`,
    );
  }

  shape("#809077", "M342 425 L397 425 L406 419 L359 414 L341 420Z");
  shape("#f6e6c4", "M351 417 V398 L368 383 L388 396 V423 H351Z");
  shape("#d4ba91", "M388 396 L399 398 V420 L388 423Z");
  shape(
    "#a88167",
    "M344 398 L366 380 L392 384 L402 399 L384 396 L367 387 L352 400Z",
  );
  shape("#87836b", "M369 423 V407 Q372 401 377 406 V423Z");
  ctx.fillStyle = "#889792";
  ctx.fillRect(356, 400, 6, 7);

  for (const [x, y, radius, color] of [
    [502, 442, 28, "#869e81"],
    [469, 465, 31, "#6f9078"],
    [545, 480, 31, "#7f9b79"],
    [520, 495, 25, "#8ba17c"],
  ] as const) {
    ctx.fillStyle = "#7b795b";
    ctx.fillRect(x - 2, y, 5, radius * 1.55);
    shape(
      color,
      `M${x - radius} ${y} Q${x - radius - 5} ${y - 19} ${x - 11} ${y - 25} Q${x + 1} ${y - 39} ${x + 14} ${y - 26} Q${x + radius + 7} ${y - 17} ${x + radius} ${y} Q${x + radius} ${y + 21} ${x} ${y + 23} Q${x - radius} ${y + 21} ${x - radius} ${y}Z`,
    );
  }

  ctx.fillStyle = "#f1e1a8";
  for (const [x, y] of [
    [73, 686],
    [86, 691],
    [115, 704],
    [140, 699],
    [497, 701],
    [515, 695],
    [533, 712],
    [553, 718],
  ]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 4, 2, -0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fixed flecks give each redraw and export the same painted texture.
  for (let point = 0; point < 1200; point++) {
    const x = ((point * 397) % 601) + ((point * 23) % 9) / 10;
    const y = ((point * point * 159 + point * 97) % 743) + 0.2;
    ctx.fillStyle = point % 2 ? "#623d2520" : "#fff8e035";
    ctx.fillRect(x, y, 1 + (point % 3) / 2, 1);
  }
}
