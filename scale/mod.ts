/**
 * Tick parameter
 */
export type TickParams = {
  /**
   * Force the start of the scale to be at a specific value. Defaults to minimum value.
   */
  start?: number;
  /**
   * Force the end of the scale to be at a specific value. Defaults to maximum value.
   */
  end?: number;
  /**
   * The desired number of ticks.
   */
  desiredCount?: number;
  /**
   * The format function to format the tick value.
   */
  format: (value: number) => string;
};

/**
 * Tick type.
 */
export type Tick = {
  /**
   * The value of the tick.
   */
  value: number;
  /**
   * The formatted value of the tick.
   */
  formattedValue: string;
};

/**
 * Generic scale interface.
 */
export type Scale = {
  /**
   * Scales a value.
   * @param value The value to scale.
   * @returns The scaled value.
   */
  scale(value: number): number;
  /**
   * Inverts a value, particularly useful when getting the value from the mouse position.
   * @param value The value to invert.
   * @returns The inverted value.
   */
  invert(value: number): number;

  ticks(tickParameters: TickParams): Tick[];
};
