import React from 'react'; // 添加这行
import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import { useTranslation } from 'react-i18next';

// ErrorBoundary 组件移到 App 组件之前
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const { t } = useTranslation();
  console.log('App rendering');

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Welcome />
        </div>
        <Services />
        <Transactions />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;