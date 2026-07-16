
import { Dimensions, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';

const PrivacyScreen = () => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const insets = useSafeAreaInsets(); // Get top/bottom safe area padding

  return (

    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}
    >
      <CommonHeader
        title={currentLocal.home.Privacy}
        filterState={false}
        currentLocal={currentLocal}

      />
      <ScrollView
        showsVerticalScrollIndicator={false}>
        {
          currentLocal.language === 'العربيه' ?
            <View>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>سياسة الخصوصية – تطبيق أسطا باشا</Text>




              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right", fontSize: 16 }]}>إخلاء مسؤولية تطبيق “أسطا باشا”</Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                يُقرّ المستخدم بأن تطبيق “أسطا باشا” هو منصة وسيطة فقط، تتيح التواصل بين مقدمي الخدمات (الفنيين/العمال) والباحثين عنها (العملاء)، ولا يتحمل التطبيق أو القائمون عليه أي مسؤولية مباشرة أو غير مباشرة عن:
              </Text>
              <View>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                  1.	جودة الخدمة المقدمة أو نتائجها.</Text>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                  2.	التزام مقدم الخدمة بالمواعيد أو الشروط المتفق عليها.</Text>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                  3.	أي خسائر أو أضرار ناتجة عن التعامل بين مقدم الخدمة والعميل.</Text>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                  4.	أي التزامات مالية أو قانونية بين الطرفين.</Text>
              </View>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                جميع التعاملات تتم على مسؤولية مقدم الخدمة والعميل بشكل كامل، ويقتصر دور التطبيق على تسهيل عملية التواصل فقط دون تقديم أي ضمانات أو تعهدات                            </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                في تطبيق أسطا باشا، نلتزم بحماية خصوصيتك وضمان أمان معلوماتك الشخصية. باستخدامك للتطبيق، فإنك توافق على سياسة الخصوصية التالية:
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                1. المعلومات التي نقوم بجمعها:

              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                عند استخدامك للتطبيق، قد نقوم بجمع:
              </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •معلومات شخصية: مثل الاسم، رقم الهاتف، البريد الإلكتروني.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •موقعك الجغرافي: لتحديد أقرب فني إليك بدقة.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •بيانات الاستخدام: مثل الصفحات التي تزورها داخل التطبيق، والأوقات التي تستخدم فيها الخدمة.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>2. كيف نستخدم المعلومات:</Text>

              <Text allowFontScaling={false} style={[styles.subText, { textAlign: "right" }]}>
                نستخدم معلوماتك فقط من أجل:

              </Text>


              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •تقديم الخدمة المطلوبة بكفاءة.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •تحسين جودة التطبيق وتجربة المستخدم.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •التواصل معك بشأن الطلبات أو العروض.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •الحماية من الاحتيال أو الاستخدام غير المشروع.
              </Text>


              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>

              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>3. مشاركة المعلومات:</Text>


              <Text allowFontScaling={false} style={[styles.subText, { textAlign: "right" }]}>
                لا نقوم ببيع أو تأجير معلوماتك لأي جهة خارجية.

              </Text>
              <Text allowFontScaling={false} style={[styles.subText, { textAlign: "right" }]}>
                قد نشارك معلوماتك فقط مع:

              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •مزوّدي الخدمة (الفنيين) لتنفيذ طلبك.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                •	جهات قانونية إذا طُلب منا ذلك بموجب القانون.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>4. أمان البيانات:</Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                نحن نتخذ جميع التدابير الفنية والإدارية اللازمة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإتلاف.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>

              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>5. ملفات تعريف الارتباط (Cookies):</Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>قد نستخدم ملفات تعريف الارتباط لتحسين أداء التطبيق وجمع بيانات تحليلية. يمكنك تعطيلها من إعدادات هاتفك.</Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>6. حقوقك كمستخدم:</Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>•يمكنك طلب تعديل أو حذف معلوماتك الشخصية.</Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>•يمكنك إلغاء الاشتراك في الرسائل التسويقية في أي وقت.</Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>7. تحديثات سياسة الخصوصية:</Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم إعلامك بأي تغيير داخل التطبيق أو عبر البريد الإلكتروني.</Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "right" }]}>8. تواصل معنا:</Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "right" }]}>إذا كان لديك أي سؤال بخصوص سياسة الخصوصية، يمكنك التواصل معنا عبر</Text>

            </View>
            :
            <View>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>Privacy Policy - Asta Pasha App</Text>

              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left", fontSize: 16 }]}>Osta Pasha App Disclaimer</Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                The user acknowledges that the Asta Pasha App is merely an intermediary platform, enabling communication between service providers (technicians/workers) and service seekers (customers). The App or its administrators bear no direct or indirect responsibility for:                            </Text>
              <View>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                  1. The quality or results of the service provided.
                </Text>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                  2. The service provider's adherence to agreed-upon deadlines or terms.
                </Text>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                  3. Any losses or damages resulting from interactions between the service provider and the customer.
                </Text>
                <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                  4. Any financial or legal obligations between the two parties.
                </Text>
              </View>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                All transactions are the sole responsibility of the service provider and the customer. The App's role is limited to facilitating communication only, without providing any guarantees or commitments.                                          </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                At the Asta Pasha app, we are committed to protecting your privacy and ensuring the security of your personal information. By using the app, you agree to the following privacy policy:                            </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                1. Information we collect:
              </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                When you use the App, we may collect:
              </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                • Personal information: such as name, phone number, email.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                •Your geographical location: To accurately locate the nearest technician to you.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                • Usage data: such as the pages you visit within the application, and the times you use the service.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>

              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>2. How we use information:</Text>

              <Text allowFontScaling={false} style={[styles.subText, { textAlign: "left" }]}>
                We only use your information to:

              </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                •Provide the required service efficiently.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                •Improving application quality and user experience.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                • Contact you regarding requests or offers.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                • Protection against fraud or illegal use.
              </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>3. Sharing information:</Text>
              <Text allowFontScaling={false} style={[styles.subText, { textAlign: "left" }]}>
                We do not sell or rent your information to any third party.
              </Text>
              <Text allowFontScaling={false} style={[styles.subText, { textAlign: "left" }]}>
                We may only share your information with:
              </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                •Service providers (technicians) to fulfill your request.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                • Legal entities if we are required to do so by law.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>4. Data security:</Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                We take all necessary technical and administrative measures to protect your data from unauthorized access, modification or destruction.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>

              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>5. Cookies:   </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                We may use cookies to improve app performance and collect analytical data. You can disable them in your phone settings.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>6. Your rights as a user: </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                •You can request to modify or delete your personal information.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                •You can unsubscribe from marketing messages at any time.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>

              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>7. Privacy Policy Updates: </Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                We may update this policy from time to time. You will be notified of any changes within the app or via email.
              </Text>
              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                ⸻
              </Text>
              <Text allowFontScaling={false} style={[styles.text, { textAlign: "left" }]}>8. Contact Us:</Text>

              <Text allowFontScaling={false} style={[styles.paragraph, { textAlign: "left" }]}>
                If you have any questions regarding our privacy policy, you can contact us via
              </Text>

            </View>
        }


      </ScrollView>
    </View>
  )
}

export default PrivacyScreen

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
    fontSize: Math.min(Dimensions.get('window').width / 12, 20),
    marginTop: 12,

  },
  paragraph: {
    fontFamily: 'SemiBoldMoto',
    fontSize: Math.min(Dimensions.get('window').width / 5, 18),
    marginTop: 12,

  },
})