import {TaskItemList} from "./components/TaskItemList";
import {TaskItemProvider} from './contexts/TaskItemContext';

const App = () => {
    return (
        <TaskItemProvider>
            <div className="min-h-screen bg-gray-100">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <TaskItemList/>
                </main>
            </div>
        </TaskItemProvider>
    );
};

export default App;
