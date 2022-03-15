# We are using Ukraine’s point of view here to have Crimea for Ukraine and not Russia.
file = ne_10m_admin_0_countries_ukr

# Include Georgia and Turkey
countries = ARM,AUT,BGR,HRV,CZE,DNK,FIN,FRA,SGS,GRC,ISL,ITA,LVA,LTU,MDA,NOR,PRT,ROU,SRB,SVK,SVN,ESP,SWE,UKR,BEL,DEU,IRL,BMU,POL,GBR,GEO,TUR

# First, we filter the shapefile by the countries European countries. We filter out Russia because it would shift it too much.
# We then calculate the centroid from this set of countries
prepare:
	mapshaper \
		source/$(file)/$(file).shp \
		-filter '(REGION_UN === "Europe" || "$(countries)".indexOf(ADM0_A3) > -1) && ADM0_A3 !== "RUS"' \
		-o source/centroid.json format=geojson
	node centroid.js

# Copy the output to clip.js
# This function creates a circular shape that we later use for clipping
clip:
	node clip.js

# Let’s get the shapefile again and select USA. Next, shift, scale and rotate it a bit.
usa:
	mapshaper \
		source/$(file)/$(file).shp \
		-filter '"USA".indexOf(ADM0_A3) > -1' \
		-affine shift=4,9 scale=0.25 rotate=-14 \
		-o target/$(file)_usa.shp

# Create a version of Europe with Russia included
europe:
	mapshaper \
		-i source/$(file)/$(file).shp\
		-filter 'REGION_UN === "Europe" || "$(countries),RUS".indexOf(ADM0_A3) > -1' \
		-o target/$(file)_europe.shp

# Combine the two shapefiles of Europe and USA
combine:
	mapshaper \
		-i target/$(file)_europe.shp target/$(file)_usa.shp combine-files \
		-merge-layers \
		-o target/$(file)_combined.shp # format=topojson

# Clip away everything that is outside of the circle. Also simplyfy the map
filter:
	mapshaper \
		-i target/$(file)_combined.shp \
		-clip source/clip.geojson \
		-simplify 0.13 \
		-o target/$(file)_filtered.json format=topojson

# Move the file to our project folder
move:
	mv target/$(file)_filtered.json ../fes-plattform/src/lib/Map/$(file)_filtered.json

edit: clip usa europe combine filter move
