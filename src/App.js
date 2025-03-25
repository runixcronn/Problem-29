import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/20/solid";

import { useReducer, useState } from "react";

// Aşağıdaki InviteUsers bileşeni, e-posta ile ekip üyesi davet etme işlemini gerçekleştirmektedir.
// Ancak şu anda herhangi bir state yönetimi bulunmamaktadır ve bileşen kullanıcı etkileşimine tepki vermemektedir.
// Amacınız useReducer kullanarak tam işlevsel bir davet bileşeni oluşturmak ve kullanıcı geri bildirimini iyileştirmektir.

// ✅ useReducer kullanarak e-posta adreslerini array içinde saklayın ve eklenen her e-postayı listeleyin.
// ✅ Kullanıcı  e-posta adresi eklediğinde ekrana “Ekip üyesi eklendi!” yerine, eklenen gerçek e-posta adresini gösterin.
// ✅ Kullanıcı yanlış formatta bir e-posta adresi girerse, input’un altına bir hata mesajı ekleyin (örn: “Geçersiz e-posta adresi”).
// ✅ Kullanıcının aynı e-posta adresini iki kez eklemesini önleyin ve uyarı mesajı gösterin.
// ✅ Kullanıcı eklenen e-postaları tek tek silebilmeli. Bir çöp kutusu ikonu ekleyerek her eklenen e-posta için “Sil” butonu oluşturun.

// Bonus:
// ✨ Input alanının içini Tailwind’in before: ve after: pseudo-elementleriyle süsleyin (örn: E-posta simgesi, animasyonlu bir underline).
// ✨ Kullanıcı hata mesajı aldığında input’un çerçevesi kırmızı renkte yanıp sönsün (animate-pulse).
// ✨ Eklenen e-posta adresleri için bir "etiket sistemi" oluşturun: Her e-posta adresi buton şeklinde bir etikete dönüştürülsün (bg-indigo-100 text-indigo-700 rounded-full px-2 py-1).
// ✨ Input alanı boşken buton disabled olsun ve opacity-50 cursor-not-allowed ile soluk görünsün.
// ✨ Kullanıcı bir e-posta eklediğinde, input alanı shake (titreme) animasyonu ile tepki versin (animate-wiggle gibi).
// ✨ Kullanıcı input’a tıklayınca, placeholder kaybolarak yukarı çıkacak şekilde bir efekt ekleyin (peer-placeholder-shown).

function reducer(state, action) {
  switch (action.type) {
    case "ADD_EMAIL":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.payload)) {
        return { ...state, error: "Geçersiz e-posta adresi" };
      }
      if (state.emails.includes(action.payload)) {
        return { ...state, error: "Bu e-posta adresi zaten ekli" };
      }
      return { emails: [...state.emails, action.payload], error: null };

    case "REMOVE_EMAIL":
      return {
        ...state,
        emails: state.emails.filter((email) => email !== action.payload),
      };

    default:
      return state;
  }
}

export default function InviteUsers() {
  const [state, dispatch] = useReducer(reducer, { emails: [], error: null });
  const [inputValue, setInputValue] = useState("");
  const [shake, setShake] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) return;
    dispatch({ type: "ADD_EMAIL", payload: inputValue });
    setInputValue("");
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  return (
    <div className="mx-auto p-8 max-w-lg">
      <Header />
      <form className="mt-6 flex" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <input
            type="email"
            name="email"
            id="email"
            className={`peer block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 
              ${state.error ? "animate-pulse ring-red-500" : ""} 
              ${shake ? "animate-wiggle" : ""}`}
            placeholder=" "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <label
            htmlFor="email"
            className={`absolute left-3 text-gray-500 transition-all duration-300 
              ${
                isFocused || inputValue
                  ? "top-[-1.25rem] text-xs text-indigo-600"
                  : "top-2.5 text-sm"
              }`}
          >
            E-posta giriniz
          </label>
          {state.error && (
            <p className="text-red-500 mt-1 text-sm">{state.error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!inputValue}
          className="ml-4 flex-shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Davetiye gönderin
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-sm font-medium text-gray-500">Ekip üyeleri</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {state.emails.map((email, index) => (
            <div
              key={index}
              className="flex items-center bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 border border-indigo-300"
            >
              <span>{email}</span>
              <button
                onClick={() =>
                  dispatch({ type: "REMOVE_EMAIL", payload: email })
                }
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center">
      <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
        Ekip üyelerini davet edin
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Projenize henüz herhangi bir ekip üyesi eklemediniz. Projenin sahibi
        olarak, ekip üyesi izinlerini yönetebilirsiniz.
      </p>
    </div>
  );
}
