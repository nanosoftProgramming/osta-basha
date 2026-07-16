import { Colors } from '@/constants/theme';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

const CustomBtn = ({title,onPressFun,loading,disabled}) => {
  
  return (
    <TouchableOpacity style={loading?styles.disactiveContainer:styles.container}onPress={!loading&&onPressFun}disabled={disabled}>
      {loading&&
            <ActivityIndicator size="small" color="gray" />

      }
 <Text allowFontScaling={false} style={loading?styles.disactiveBtnText:styles.btnText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomBtn

const styles = StyleSheet.create({
    container:{
        borderWidth:1,
        borderColor:Colors.light.tint,
        // height: Dimensions.get("screen").height / 19.33,
        justifyContent:"center",
        alignItems:"center",
        paddingHorizontal:32,
        borderRadius:8,
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:Colors.light.tint,
        // height:Dimensions.get('screen').height/16,
        padding:12


    },
    disactiveContainer:{
        borderWidth:1,
        borderColor:"gray",
        // height: Dimensions.get("screen").height / 19.33,
        justifyContent:"center",
        alignItems:"center",
        paddingHorizontal:32,
        borderRadius:8,
        flexDirection:"row",
        alignItems:"center",
        padding:12




    },
    btnText:{
        fontSize: 14,
        color:"#fff",
        fontFamily: "BoldMoto",

    },
    disactiveBtnText:{
      fontSize: 14,
      color:"gray",
      fontFamily: "BoldMoto",

    }
})