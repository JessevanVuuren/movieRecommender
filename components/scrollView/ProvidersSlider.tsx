import { Dimensions, StyleSheet, Image, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react"
import { base_url_342, get_providers } from "../../src/fetcher";
import { ProvidersModel } from "../../models/providers";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";
import { baseUrl342 } from "../../src/helper";
import { RegionsModel } from "../../models/regions";

interface ProvidersSliderProps {
	region:RegionsModel
}

const ProvidersSlider: React.FC<ProvidersSliderProps> = props => {
	const [data, setData] = useState<ProvidersModel[]>([])

  const _layoutProvider = useRef(layoutMaker()).current;
  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);

	useEffect(() => {
		if (props.region == undefined) return
		console.log("region")
		console.log(props.region)
		setup(props.region.iso_3166_1)
	}, [props.region])


	const setup = async (region:string) => {
		const providers = await get_providers(region, "movie")	

		const data = []
		providers.map(e => {
			data.push({type: "NORMAL", item: e});
		})
		setData(data)
	}

	const rowRenderer = (type, data) => {
    return (
      <View style={styles.providerHolder}>
				<Image style={{ height: 60, width: 60, marginRight: 0, borderRadius: 9 }} source={{ uri: base_url_342 + data.item.logo_path }} />
      </View>
    );
  };

	if (!data.length) return null;

	return (
    <View style={{  flex:1, marginTop:5 }}>
      <RecyclerListView isHorizontal={true} layoutProvider={_layoutProvider} dataProvider={dataProvider} rowRenderer={rowRenderer} />
    </View>
	)
}

export default ProvidersSlider


const styles = StyleSheet.create({
	container: {

	},
	providerHolder: {
    paddingLeft: Dimensions.get("window").width * 0.04,
	}
})

const dataProviderMaker = (data) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

const layoutMaker = () =>
  new LayoutProvider(
    (i) => {
      return "NORMAL";
    },
		(type, dim) => {
			switch (type) {
				case "NORMAL":
					dim.width = 70;
					dim.height = 70;
					break;
			}
    }
  );
