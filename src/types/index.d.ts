export declare namespace Prefectures {
  namespace Constants {
    type ViewLabel = '総人口' | '年少人口' | '生産年齢人口' | '老年人口'
  }

  namespace Response {
    interface List {
      message: null;
      result: Array<{
        prefCode: number;
        prefName: string;
      }>
    }

    interface PopulationData {
      label: Constants.ViewLabel;
      data: Array<{
        value: number;
        year: number;
      }>
    }

    interface Population {
      message: null;
      result: {
        boundaryYear: number;
        data: Array<PopulationData>
      };
    }
  }
}
