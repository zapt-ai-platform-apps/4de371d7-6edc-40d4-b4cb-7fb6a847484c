import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [petDescription, setPetDescription] = createSignal('');
  const [petGender, setPetGender] = createSignal('Male');
  const [suggestedNames, setSuggestedNames] = createSignal([]);
  const [savedNames, setSavedNames] = createSignal([]);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const handleGenerateNames = async () => {
    if (!petDescription()) return;
    setLoading(true);
    try {
      const genderText = petGender().toLowerCase();
      const result = await createEvent('chatgpt_request', {
        prompt: `Suggest 10 unique ${genderText} pet names for a pet described as: ${petDescription()}. Return the results as a JSON object with the following structure: { "names": ["name1", "name2", ... ] }`,
        response_type: 'json'
      });
      setSuggestedNames(result.names || []);
    } catch (error) {
      console.error('Error generating names:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedNames = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/getNames', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSavedNames(data);
      } else {
        console.error('Error fetching saved names:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching saved names:', error);
    }
  };

  const saveName = async (name) => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/saveName', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, gender: petGender() }),
      });
      if (response.ok) {
        const savedName = await response.json();
        setSavedNames([...savedNames(), savedName]);
      } else {
        console.error('Error saving name');
      }
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  createEffect(() => {
    if (user()) {
      fetchSavedNames();
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-green-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-green-600">Name My Pet</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-2xl font-bold mb-4 text-green-600">Describe Your Pet</h2>
            <textarea
              rows="4"
              placeholder="Describe your pet (e.g., a small playful brown dog with a curly tail)"
              value={petDescription()}
              onInput={(e) => setPetDescription(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent box-border"
            />
            <div class="mt-4">
              <label class="block text-lg font-medium text-gray-700 mb-2">Select the gender of your pet:</label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={petGender() === 'Male'}
                    onChange={() => setPetGender('Male')}
                    class="form-radio h-5 w-5 text-green-600 cursor-pointer"
                  />
                  <span class="ml-2 text-gray-700">Male</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={petGender() === 'Female'}
                    onChange={() => setPetGender('Female')}
                    class="form-radio h-5 w-5 text-green-600 cursor-pointer"
                  />
                  <span class="ml-2 text-gray-700">Female</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={petGender() === 'Other'}
                    onChange={() => setPetGender('Other')}
                    class="form-radio h-5 w-5 text-green-600 cursor-pointer"
                  />
                  <span class="ml-2 text-gray-700">Other</span>
                </label>
              </div>
            </div>
            <button
              class={`mt-6 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateNames}
              disabled={loading()}
            >
              <Show when={loading()}>
                Generating Names...
              </Show>
              <Show when={!loading()}>
                Generate Names
              </Show>
            </button>
          </div>

          <Show when={suggestedNames().length > 0}>
            <div class="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 class="text-2xl font-bold mb-4 text-green-600">Suggested Names</h2>
              <ul class="space-y-2">
                <For each={suggestedNames()}>
                  {(name) => (
                    <li class="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">
                      <span>{name}</span>
                      <button
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        onClick={() => saveName(name)}
                      >
                        Save
                      </button>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </Show>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-green-600">My Saved Names</h2>
            <Show when={savedNames().length > 0} fallback={<p>You haven't saved any names yet.</p>}>
              <ul class="space-y-2">
                <For each={savedNames()}>
                  {(nameEntry) => (
                    <li class="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <span>{nameEntry.name}</span>
                      <span class="text-gray-600 italic">{nameEntry.gender}</span>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>

        </div>
      </Show>
    </div>
  );
}

export default App;