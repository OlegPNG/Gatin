// App.js
import Header from './components/Header'; // Correct import path

// Other imports
import Sidebar from './components/Sidebar';
import ChapterList from './components/ChapterList';

function App() {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <Header />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flex: 1, padding: '1rem' }}>
                    <ChapterList />
                </main>
            </div>
        </div>
    );
}

export default App;
