
import { Dimensions, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';

const AboutusScreen = () => {
    const { currentLocal } = useSelector((state) => state.Localization);
  const insets = useSafeAreaInsets();

    return (
 
        <View 
              style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}
        >
           <CommonHeader
          title={currentLocal.home.aboutus}
          filterState={false}
          currentLocal={currentLocal}
  
        />
            <ScrollView
                showsVerticalScrollIndicator={false}>
                {
                    currentLocal.language === 'العربيه' ?
                        <View>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "right" }]}>🧰 من نحن – أسطا باشا</Text>
                            <Text allowFontScaling={false}style={[styles.subText, { textAlign: "right" }]}>
                                مرحبًا بك في أسطا باشا – تطبيقك الأول لحل كل مشاكلك المنزلية بسهولة وأمان!

                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                نحن فريق من الشباب المتخصصين، اجتمعنا على هدف واحد: تبسيط الوصول إلى الخدمات المنزلية الموثوقة في كل وقت ومكان.
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                سواء كنت تبحث عن كهربائي، سباك، نجّار، مكيّف، أو أي خدمة فنية أخرى، تطبيق أسطا باشا يوصلك بأفضل الفنيين المعتمدين بجودة عالية وسرعة في التنفيذ
                            </Text>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "right" }]}>🎯 رؤيتنا</Text>

                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                أن نكون المنصة الأولى في العالم العربي التي تربط بين أصحاب المنازل والمهنيين المهرة بكل سهولة وشفافية، ونبني مجتمعًا من الثقة والاحترافية.
                            </Text>

                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                ⸻
                            </Text>

                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "right" }]}>💡 مهمتنا</Text>

                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                •	تقديم خدمات منزلية عالية الجودة بأسعار شفافة
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                •	ربط العملاء بمهنيين تم التحقق من كفاءتهم
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                •	ضمان راحة وأمان المستخدم من أول نقرة حتى انتهاء المهمة
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                ⸻
                            </Text>

                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "right" }]}>🔒 لماذا تختار أسطا باشا؟</Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                •🛠️ فنيون مدربون وموثوقون
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                •⏱️ حجز فوري وسريع
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                •💬 تقييمات حقيقية من العملاء
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                •📍 خدمة حسب موقعك الجغرافي
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                ⸻
                            </Text>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "right" }]}>🤝 معك خطوة بخطوة</Text>

                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                في أسطا باشا، نحن لا نوفر خدمة فقط، بل نرافقك حتى تحل مشكلتك بالكامل وبأعلى جودة. نحن نؤمن أن راحة بالك تبدأ من “أسطا” تعرف إن شغله مضمون.
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                ⸻
                            </Text>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "right" }]}>💬 تواصل معنا</Text>
                            <Text allowFontScaling={false}style={[styles.subText, { textAlign: "right" }]}>
                                هل عندك سؤال أو اقتراح؟
                            </Text>


                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "right" }]}>
                                فريق الدعم في خدمتك دائمًا. تواصل معنا عبر التطبيق أو الواتساب أو الإيميل، وسنكون سعداء بخدمتك.
                            </Text>
                        </View>
                        :
                        <View>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "left" }]}>🧰 About us - Usta Pasha</Text>
                            <Text allowFontScaling={false}style={[styles.subText, { textAlign: "left" }]}>
                                Welcome to Asta Pasha – your number one app to solve all your household problems easily and safely!
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                We are a team of young professionals, united by one goal: to simplify access to reliable home services anytime, anywhere.
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                Whether you are looking for an electrician, plumber, carpenter, air conditioner, or any other technical service, the Osta Pasha app connects you with the best certified technicians with high quality and speed of implementation.
                            </Text>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "left" }]}>🎯  Our vision</Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                To be the first platform in the Arab world that connects homeowners and skilled professionals with ease and transparency, building a community of trust and professionalism.
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                ⸻
                            </Text>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "left" }]}>💡 Our mission</Text>




                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                • Connecting clients with verified professionals
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                • Ensure user comfort and safety from the first click until the task is completed.
                            </Text>

                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                ⸻
                            </Text>


                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "left" }]}>🔒 Why choose Asta Pasha?

                            </Text>

                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                •🛠️ Trained and reliable technicians
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                •⏱️ Instant and fast booking
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                •💬 Real customer reviews
                            </Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                •📍 Service according to your geographical location
                            </Text>


                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                ⸻
                            </Text>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "left" }]}>🤝 With you step by step</Text>
                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                At Asta Pasha, we don't just provide a service; we accompany you until your problem is fully resolved with the highest quality. We believe that your peace of mind begins with a "Asta" whose work is guaranteed.                            </Text>


                            <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
                                ⸻
                            </Text>
                            <Text allowFontScaling={false}style={[styles.text, { textAlign: "left" }]}>💬 Contact us</Text>

                            <Text allowFontScaling={false}style={[styles.subText, { textAlign: "left" }]}>
                                Do you have a question or suggestion?
                            </Text>
      <Text allowFontScaling={false}style={[styles.paragraph, { textAlign: "left" }]}>
Our support team is always at your service. Contact us via the app, WhatsApp, or email, and we'll be happy to assist you.
                            </Text>
                        </View>
                }


            </ScrollView>
        </View>
    )
}

export default AboutusScreen

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
    },
    text: {
        fontFamily: 'BoldMoto',
        fontSize: Math.min(Dimensions.get('window').width / 10, 20),
        marginTop: 22,
    },
    subText: {
        fontFamily: 'SemiBoldMoto',
        // fontSize: Dimensions.get("screen").width / 28,
                fontSize: Math.min(Dimensions.get('window').width / 12, 20),

        marginTop: 12,

    },
    paragraph: {
        fontFamily: 'SemiBoldMoto',
        // fontSize: Dimensions.get("screen").width / 32,
       fontSize: Math.min(Dimensions.get('window').width / 5, 18),

        marginTop: 12,

    },
})