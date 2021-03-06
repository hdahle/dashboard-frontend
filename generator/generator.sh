#!/bin/sh

JSFILE=redis-values.js
JSFILE2=redis-values2.js
echo `date` " Generator starting"

echo "let redisCO2Daily=" > ${JSFILE}
curl -s "https://api.dashboard.eco/co2-daily" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCO2Daily" 
wc ${JSFILE}

echo "let redisCO2Now=" >> ${JSFILE}
curl -s "https://api.dashboard.eco/maunaloaco2-daily" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCO2Now" 
wc ${JSFILE}

echo "let redisCovidDeathsSelect=" >> ${JSFILE}
curl -s "https://api.dashboard.eco/covid-deaths-select" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCovidDeathsSelect" 
wc ${JSFILE}

echo "let redisCovidDeathsTop=" >> ${JSFILE}
curl -s "https://api.dashboard.eco/covid-deaths-top" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCovidDeathsTop" 
wc ${JSFILE}

echo "let redisMaunaLoaCO2Sm=" >> ${JSFILE}
curl -s "http://api.dashboard.eco/maunaloaco2-sm" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisMaunaLoaCO2Sm" 
wc ${JSFILE}

echo "let redisMaunaLoaAnnualMean=" >> ${JSFILE}
curl -s "http://api.dashboard.eco/maunaloa-annual-mean" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisMaunaLoaAnnualMean" 
wc ${JSFILE}

echo "let redisLaw2018CO2=" >> ${JSFILE}
curl -s "http://api.dashboard.eco/law2018co2" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisLaw2018CO2" 
wc ${JSFILE}

echo "let redisVostok=" >> ${JSFILE}
curl -s "http://api.dashboard.eco/vostok" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisVostok" 
wc ${JSFILE}

echo "let redisMaunaLoaCH4Sm=" >> ${JSFILE}
curl -s "http://api.dashboard.eco/maunaloach4-sm" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisMaunaLoaCH4Sm" 
wc ${JSFILE}

echo "let redisSpainElectricity=[" >> ${JSFILE}
for YEAR in "2020" "2019" "2018" "2017" "2016" 
do
  curl -s "http://api.dashboard.eco/spain-electricity-${YEAR}" >> ${JSFILE}
  echo "," >> ${JSFILE}
done
echo "];" >> ${JSFILE}
echo -n "redisSpainElectricity" 
wc ${JSFILE}

echo "let redisGlaciers=[" >> ${JSFILE}
for GLACIER in  'Styggedalsbreen' 'Bondhusbrea' 'Boyabreen' 'Buerbreen' 'Hellstugubreen' 'Storbreen' 'Stigaholtbreen' 'Briksdalsbreen' 'Rembesdalskaaka' 'Engabreen' 'Faabergstolsbreen' 'Nigardsbreen' 'Lodalsbreen'
do
  curl -s "http://api.dashboard.eco/glacier-length-nor-${GLACIER}" >> ${JSFILE}
  echo "," >> ${JSFILE}
done
echo "];" >> ${JSFILE}
echo -n "redisGlaciers" 
wc ${JSFILE}

echo "let redisCircularity2020=" >> ${JSFILE}
curl -s "http://api.dashboard.eco/circularity-2020" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCircularity2020" 
wc ${JSFILE}

echo "let redisEmissionsByRegion =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/emissions-by-region" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEmissionsByRegion" 
wc ${JSFILE}

echo "let redisEmissionsNorway =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/emissions-norway" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEmissionsNorway" 
wc ${JSFILE}

echo "let redisIceNsidc =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/ice-nsidc" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisIceNsidc" 
wc ${JSFILE}

echo "let redisPopulationByRegion =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/WPP2019_TotalPopulationByRegion" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisPopulationByRegion" 
wc ${JSFILE}

echo "let redisEiaGlobalOil =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/eia-global-oil" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEiaGlobalOil" 
wc ${JSFILE}

echo "let redisEiaGlobalGas =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/eia-global-gas" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEiaGlobalGas" 
wc ${JSFILE}

echo "let redisEiaGlobalCoal =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/eia-global-coal" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEiaGlobalCoal" 
wc ${JSFILE}

echo "let redisEiaGlobalElectricity =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/eia-global-electricity" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEiaGlobalElectricity" 
wc ${JSFILE}

echo "let redisEmissionsByFuelType =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/emissions-by-fuel-type" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEmissionsByFuelType" 
wc ${JSFILE}

echo "let redisQueimadasBrazil =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/queimadas-brazil" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisQueimadasBrazil" 
wc ${JSFILE}

echo "let redisOperationalCCS =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/operational-ccs" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisOperationalCCS" 
wc ${JSFILE}

echo "let redisPlannedCCS =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/planned-ccs" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisPlannedCCS" 
wc ${JSFILE}

echo "let redisMortalityElectricity =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/mortality-electricity" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisMortalityElectricity" 
wc ${JSFILE}

echo "let redisMortalityElectricitySovacool =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/mortality-electricity-sovacool" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisMortalityElectricitySovacool" 
wc ${JSFILE}

echo "let redisMortalityElectricityMarkandya =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/mortality-electricity-markandya" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisMortalityElectricityMarkandya" 
wc ${JSFILE}

echo "let redisOzoneNasa =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/ozone-nasa" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisOzoneNasa" 
wc ${JSFILE}

echo "let redisTemperatureSvalbard =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/temperature-svalbard" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisTemperatureSvalbard" 
wc ${JSFILE}

echo "let redisGlobalTemperatureAnomaly =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/global-temperature-anomaly" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisGlobalTemperatureAnomaly" 
wc ${JSFILE}

echo "let redisGlobalTemperatureHadcrut =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/global-temperature-hadcrut" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisGlobalTemperatureHadcrut" 
wc ${JSFILE}

echo "let redisGlobalTemperatureUah =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/global-temperature-uah" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisGlobalTemperatureUah" 
wc ${JSFILE}

echo "let redisCsiroRecons2015 =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/CSIRO_Recons_2015" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCsiroRecons2015" 
wc ${JSFILE}

echo "let redisCsiroAltYearly =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/CSIRO_Alt_yearly" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCsiroAltYearly" 
wc ${JSFILE}

echo "let redisCsiroAlt =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/CSIRO_Alt" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCsiroAlt" 
wc ${JSFILE}

echo "let redisNorwayTrafficSmestad=[" >> ${JSFILE}
for STATION in 'smestad-2020' 'smestad-2019'
do
  curl -s "http://api.dashboard.eco/norway-traffic-${STATION}" >> ${JSFILE}
  echo "," >> ${JSFILE}
done
echo "];" >> ${JSFILE}
echo -n "redisNorwayTrafficSmestad" 
wc ${JSFILE}

echo "let redisNorwayTrafficBaneheia=[" >> ${JSFILE}
for STATION in 'baneheia-2020' 'baneheia-2019'
do
  curl -s "http://api.dashboard.eco/norway-traffic-${STATION}" >> ${JSFILE}
  echo "," >> ${JSFILE}
done
echo "];" >> ${JSFILE}
echo -n "redisNorwayTrafficBaneheia" 
wc ${JSFILE}

echo "let redisSchipholFlights=[" >> ${JSFILE}
for YEAR in '2020'
do
  curl -s "http://api.dashboard.eco/schiphol-flights-${YEAR}" >> ${JSFILE}
  echo "," >> ${JSFILE}
done
echo "];" >> ${JSFILE}
echo -n "redisSchipholFlights"
wc ${JSFILE}

echo "let redisCovidDeathsRegions =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/covid-deaths-regions" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisCovidDeathsRegions" 
wc ${JSFILE}

echo "let redisIrena2020 =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/irena-2020" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisIrena2020" 
wc ${JSFILE}


echo "let redisEiaLcoe =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/eia-lcoe-2025" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEiaLcoe" 
wc ${JSFILE}

echo "let redisWri2016 =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/wri-2016" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisWri2016" 
wc ${JSFILE}

echo "let redisOxfam2020 =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/oxfam-2020" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisOxfam2020" 
wc ${JSFILE}

echo "let redisGlobalEwaste =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/globalewaste-2020" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisGlobalEwaste" 
wc ${JSFILE}

echo "let redisPlasticWaste =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/plastic-waste-2016" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisPlasticWaste" 
wc ${JSFILE}

echo "let redisBitcoinPower =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/bitcoin-power" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisBitcoinPower" 
wc ${JSFILE}

echo "let redisBitcoinPrice =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/bitcoin-price" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisBitcoinPrice" 
wc ${JSFILE}

echo "let redisPolestar =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/polestar" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisPolestar" 
wc ${JSFILE}

echo "let redisEindhoven =" >> ${JSFILE}
curl -s "http://api.dashboard.eco/eindhoven" >> ${JSFILE}
echo ";" >> ${JSFILE}
echo -n "redisEindhoven" 
wc ${JSFILE}

echo "let redisCovidDeathsSummary =" > ${JSFILE2}
curl -s "http://api.dashboard.eco/covid-deaths-summary" >> ${JSFILE2}
echo ";" >> ${JSFILE2}
echo -n "redisCovidDeathsSummary" 
wc ${JSFILE2}

echo "let redisCovidConfirmedSummary =" >> ${JSFILE2}
curl -s "http://api.dashboard.eco/covid-confirmed-summary" >> ${JSFILE2}
echo ";" >> ${JSFILE2}
echo -n "redisCovidConfirmedSummary" 
wc ${JSFILE2}

