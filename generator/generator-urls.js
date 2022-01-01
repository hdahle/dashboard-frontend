const urlmap = [
  {
    url: "http://api.dashboard.eco/co2-daily",
    varName: "redisCO2Daily"
  },
  {
    url: "http://api.dashboard.eco/maunaloaco2-daily",
    varName: "redisCO2Now"
  },
  {
    url: "http://api.dashboard.eco/covid-deaths-select",
    varName: "redisCovidDeathsSelect"
  },
  {
    url: "http://api.dashboard.eco/covid-deaths-top",
    varName: "redisCovidDeathsTop"
  },
  {
    url: "http://api.dashboard.eco/maunaloaco2-sm",
    varName: "redisMaunaLoaCO2Sm"
  },
  {
    url: "http://api.dashboard.eco/maunaloa-annual-mean",
    varName: "redisMaunaLoaAnnualMean"
  },
  {
    url: "http://api.dashboard.eco/law2018co2",
    varName: "redisLaw2018CO2"
  },
  {
    url: "http://api.dashboard.eco/vostok",
    varName: "redisVostok"
  },
  {
    url: "http://api.dashboard.eco/maunaloach4-sm",
    varName: "redisMaunaLoaCH4Sm"
  },
  {
    url: "http://api.dashboard.eco/glacier-length-nor-all",
    varName: "redisGlaciers"
  },
  {
    url: "http://api.dashboard.eco/circularity-2020",
    varName: "redisCircularity2020"
  },
  {
    url: "http://api.dashboard.eco/emissions-by-region",
    varName: "redisEmissionsByRegion"
  },
  {
    url: "http://api.dashboard.eco/emissions-norway",
    varName: "redisEmissionsNorway"
  },
  {
    url: "http://api.dashboard.eco/ice-nsidc",
    varName: "redisIceNsidc"
  },
  {
    url: "http://api.dashboard.eco/ice-nsidc2",
    varName: "redisIceNsidc2"
  },
  {
    url: "http://api.dashboard.eco/WPP2019_TotalPopulationByRegion",
    varName: "redisPopulationByRegion"
  },
  {
    url: "http://api.dashboard.eco/population-by-region",
    varName: "redisPopulationByRegion2"
  },
  {
    url: "http://api.dashboard.eco/eia-global-oil",
    varName: "redisEiaGlobalOil"
  },
  {
    url: "http://api.dashboard.eco/eia-global-gas",
    varName: "redisEiaGlobalGas"
  },
  {
    url: "http://api.dashboard.eco/eia-global-coal",
    varName: "redisEiaGlobalCoal"
  },
  {
    url: "http://api.dashboard.eco/eia-global-electricity",
    varName: "redisEiaGlobalElectricity"
  },
  {
    url: "http://api.dashboard.eco/emissions-by-fuel-type",
    varName: "redisEmissionsByFuelType"
  },
  {
    url: "http://api.dashboard.eco/queimadas-brazil",
    varName: "redisQueimadasBrazil"
  },
  {
    url: "http://api.dashboard.eco/operational-ccs-2020",
    varName: "redisOperationalCCS2020"
  },
  {
    url: "http://api.dashboard.eco/mortality-electricity",
    varName: "redisMortalityElectricity"
  },
  {
    url: "http://api.dashboard.eco/mortality-electricity-sovacool",
    varName: "redisMortalityElectricitySovacool"
  },
  {
    url: "http://api.dashboard.eco/mortality-electricity-markandya",
    varName: "redisMortalityElectricityMarkandya"
  },
  {
    url: "http://api.dashboard.eco/ozone-nasa",
    varName: "redisOzoneNasa"
  },
  {
    url: "http://api.dashboard.eco/temperature-svalbard",
    varName: "redisTemperatureSvalbard"
  },
  {
    url: "http://api.dashboard.eco/global-temperature-anomaly",
    varName: "redisGlobalTemperatureAnomaly"
  },
  {
    url: "http://api.dashboard.eco/global-temperature-hadcrut",
    varName: "redisGlobalTemperatureHadcrut"
  },
  {
    url: "http://api.dashboard.eco/global-temperature-uah",
    varName: "redisGlobalTemperatureUah"
  },
  {
    url: "http://api.dashboard.eco/CSIRO_Recons_2015",
    varName: "redisCsiroRecons2015"
  },
  {
    url: "http://api.dashboard.eco/CSIRO_Alt_yearly",
    varName: "redisCsiroAltYearly"
  },
  {
    url: "http://api.dashboard.eco/CSIRO_Alt",
    varName: "redisCsiroAlt"
  },
  {
    url: "http://api.dashboard.eco/covid-deaths-regions",
    varName: "redisCovidDeathsRegions"
  },
  {
    url: "http://api.dashboard.eco/irena-2020",
    varName: "redisIrena2020"
  },
  {
    url: "http://api.dashboard.eco/irena-2021",
    varName: "redisIrena2021"
  },
  {
    url: "http://api.dashboard.eco/eia-lcoe-2025",
    varName: "redisEiaLcoe"
  },
  {
    url: "http://api.dashboard.eco/wri-2016",
    varName: "redisWri2016"
  },
  {
    url: "http://api.dashboard.eco/oxfam-2020",
    varName: "redisOxfam2020"
  },
  {
    url: "http://api.dashboard.eco/globalewaste-2020",
    varName: "redisGlobalEwaste"
  },
  {
    url: "http://api.dashboard.eco/plastic-waste-2016",
    varName: "redisPlasticWaste"
  },
  {
    url: "http://api.dashboard.eco/bitcoin-power",
    varName: "redisBitcoinPower"
  },
  {
    url: "http://api.dashboard.eco/bitcoin-price",
    varName: "redisBitcoinPrice"
  },
  {
    url: "http://api.dashboard.eco/polestar",
    varName: "redisPolestar"
  },
  {
    url: "http://api.dashboard.eco/eindhoven",
    varName: "redisEindhoven"
  },
  {
    url: "http://api.dashboard.eco/eu-antibiotics-details-2018",
    varName: "redisEuAntibioticsDetails2018"
  },
  {
    url: "http://api.dashboard.eco/oecd-meat-2020",
    varName: "redisOecdMeat2020"
  },
  {
    url: "http://api.dashboard.eco/oecd-meat-sorted-2019",
    varName: "redisOecdMeatSorted2019"
  },
  {
    url: "http://api.dashboard.eco/poore-nemecek-2018",
    varName: "redisPooreNemecek2018"
  }
];

const urlmap2 = [
  {
    url: "http://api.dashboard.eco/covid-deaths-summary",
    varName: "redisCovidDeathsSummary"
  },
  {
    url: "http://api.dashboard.eco/covid-confirmed-summary",
    varName: "redisCovidConfirmedSummary"
  }
];

module.exports = {
  urlmap,
  urlmap2
};