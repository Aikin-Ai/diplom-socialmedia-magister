import Sidebar from "@/app/sidebar/sidebar";
import { createServerComponentClient } from "@/components/CreateServerComponentClient";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function SubscriptionPage() {
    const supabase = createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }
    const { data: current_user_data } = await supabase
        .from("profiles")
        .select(`avatar_url, username`)
        .eq('id', session.user.id)
        .single()

    return (
        <div className="flex">
            <Sidebar current_user_data={current_user_data} />
            <div className="text-white w-full max-w-xl min-w-[600px] ml-4 mr-auto">
                <div className="flex justify-start px-4 py-6 border border-gray-800 border-t-0">
                    <Image
                        src="/Coat_of_arms_of_Kharkiv.svg"
                        width={25}
                        height={25}
                        alt="Kharkiv"
                    ></Image>
                    <h1 className="text-xl font-bold ml-2">Підписка</h1>
                </div>
                <div className="px-4 py-6 border border-gray-800 border-t-0">
                    <div className="flex flex-col justify-center text-center">
                        <div className="text-xl font-bold">
                            200грн/місяць
                        </div>
                        <a
                            className="py-2 px-4 border rounded-md no-underline bg-blue-500 hover:bg-blue-700 cursor-pointer font-bold"
                            href="mailto: andreyrez02@gmail.com?subject=Підписка&body=Інтересує%20підписка"
                        >
                            Підписатися
                        </a>
                        <br />
                    </div>
                    <h1 className="text-xl font-bold text-center">🌟 Представляємо Преміум Верифікацію Плюс: Підвищуйте свою соціальну присутність! 🌟</h1>
                    <p>Ви готові вивести свою гру в соціальних мережах на новий рівень? Уявіть, що поруч з вашим ім'ям висить підтверджений бейдж, який миттєво встановлює довіру та авторитет серед вашої аудиторії. А тепер уявіть доступ до глибокої аналітики, яка розкриває справжній вплив вашого контенту. З Premium Verification Plus ці мрії стають вашою соціальною реальністю!</p>
                    <h2 className="text-center font-bold text-lg">🔐Розблокуйте значок автентичності: Перевірено та підтверджено!</h2>
                    <p>Отримайте найвищий ступінь достовірності з нашим ексклюзивним значком верифікації. Виокремте себе з натовпу і покажіть світові, що ваш профіль - справжній. Встановіть довіру з вашими підписниками, співробітниками та клієнтами, як ніколи раніше. Синя галочка - це не просто символ, це заява про те, що ви серйозно ставитеся до своєї присутності в Інтернеті.</p>
                    <h2 className="text-center font-bold text-lg">📈Потужна аналітика: Розкрийте секрети свого успіху!</h2>
                    <p>Знання - це сила, особливо в цифровому світі. Premium Verification Plus надає вам розширену аналітику, яка виходить за рамки базових даних. Пориньте вглиб ефективності вашого контенту за допомогою:
                        <br />
                        Перегляди постів: Зрозумійте, скільки очей прикуто до вашого контенту.
                        <br />
                        Показники залучення: Вимірюйте вподобання, коментарі та поширення, щоб оцінити взаємодію з аудиторією.
                        <br />
                        Демографічні дані: Дізнайтеся більше про свою аудиторію за допомогою даних про вік, місцезнаходження та інтереси.
                        <br />
                        Піковий час публікації: Оптимізуйте свою контент-стратегію, знаючи найкращий час для публікації для досягнення максимального ефекту.
                    </p>
                    <h2 className="text-center font-bold text-lg">🚀Будьте на крок попереду: Майбутнє соціального впливу!</h2>
                    <p>Соціальні мережі постійно розвиваються, і Premium Verification Plus гарантує, що ви будете на передовій. Отримайте ранній доступ до нових функцій, бета-тестів та ексклюзивних інструментів, які допоможуть вам бути на крок попереду. Ваш успіх - наш пріоритет, і ми прагнемо надати вам інструменти, які допоможуть вам досягти успіху.</p>
                    <h2 className="text-center font-bold text-lg">💎Пріоритетна підтримка: Ваш успіх - наша місія!</h2>
                    <p>Як учасник програми Premium Verification Plus, ви не просто користувач - ви є частиною елітної спільноти. Насолоджуйтесь пріоритетною підтримкою клієнтів, щоб швидко вирішити ваші запитання та проблеми. Ваш успіх - це наша місія, і ми тут, щоб підтримати вас на кожному кроці.</p>
                    <h2 className="text-center font-bold text-lg">💡Готові підвищити свій соціальний статус? Приєднуйтесь до Premium Verification Plus вже сьогодні!</h2>
                    <p>Перейдіть на Premium Verification Plus зараз і змініть свою присутність у соціальних мережах. Незалежно від того, чи є ви впливовою особою, власником бізнесу або творцем-початківцем, ця підписка - ваш ключ до відкриття світу можливостей. Забезпечте собі місце серед перевіреної еліти та візьміть під контроль свою цифрову долю!</p>
                    <h2 className="text-center font-bold text-lg">🌐Підпишіться зараз і дозвольте своїй соціальній подорожі злетіти до нових висот! 🚀</h2>
                    <div className="flex flex-col justify-center text-center">
                        <br />
                        <div className="text-xl font-bold">
                            200грн/місяць
                        </div>
                        <a
                            className="py-2 px-4 border rounded-md no-underline bg-blue-500 hover:bg-blue-700 cursor-pointer font-bold"
                            href="mailto: andreyrez02@gmail.com?subject=Підписка&body=Інтересує%20підписка"
                        >
                            Підписатися
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
