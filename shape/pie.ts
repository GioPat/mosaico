export type Arc = {
  /**
   * Index of the arc.
   */
  index: number;

  /**
   * Value of the arc.
   */
  value: number;

  /**
   * Start angle of the arc.
   */
  startAngle: number;

  /**
   * End angle of the arc.
   */
  endAngle: number;
};

type SortFunction = (a: number, b: number) => number;

type PieInitParams = {
  data: number[];
  /**
   * Sort comparator function. See [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) for details.
   * @param a
   * @param b
   * @returns number
   */
  sort: SortFunction;
};

type ChainablePie = {
  (): Arc[];
  sort(sort: SortFunction): ChainablePie;
};

const pie = (initParams?: PieInitParams): ChainablePie => {
  const returningPie = (() => {
    return [] as Arc[];
  }) as ChainablePie;

  returningPie.sort = (sort: SortFunction) => {
    console.log("Sorting...");
    return returningPie;
  };

  return returningPie;
};
