import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Sun,
  Moon,
  School2,
  UserPlus,
  Users,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Calendar,
  DollarSign,
  Wallet,
  UserCheck,
  UserX,
  Users2,
  IndianRupee,
  BadgeCheck,
  CreditCard,
  Wallet2,
  HandHelping
} from "lucide-react";

const AdminPanel = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };
  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);


  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    paidFees: 0,
    balanceFees: 0,
    parentsPaidFees: 0,
    parentsRemainingFees: 0,
    sponsorDeclaredFees: 0,
    sponsorPaidFees: 0,
    sponsorRemainingFees: 0,
    fullSponsoredStudents: 0,
    semiSponsoredStudents: 0,
    notSponsoredStudents: 0,
  });

  const fetchStats = async () => { 
    try {
      const response = await axios.get("http://localhost:5000/api/dashboard/stats");

      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 30 seconds (optional)
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);


  const statsData = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users2,
      color: "bg-blue-500",
    },
    {
      title: "Total Fees",
      value: `₹${(stats?.totalFees || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-purple-500",
    },
    {
      title: "Paid Fees",
      value: `₹${(stats?.paidFees || 0).toLocaleString()}`,
      icon: BadgeCheck,
      color: "bg-green-500",
    },
    {
      title: "Balance Fees",
      value: `₹${(stats?.balanceFees || 0).toLocaleString()}`,
      icon: Wallet,
      color: "bg-orange-500",
    },
    {
      title: "Parents Declared Fees",
      value: `₹${(stats?.parentsDeclaredFees || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-indigo-400",
    },
    {
      title: "Parents Paid Fees",
      value: `₹${(stats?.parentsPaidFees || 0).toLocaleString()}`,
      icon: Wallet,
      color: "bg-green-400",
    },
    {
      title: "Parents Remaining Fees",
      value: `₹${(stats?.parentsRemainingFees || 0).toLocaleString()}`,
      icon: Wallet,
      color: "bg-orange-400",
    },
    {
      title: "Sponsor Declared Fees",
      value: `₹${(stats?.sponsorDeclaredFees || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-purple-400",
    },
    {
      title: "Sponsor Paid Fees",
      value: `₹${(stats?.sponsorPaidFees || 0).toLocaleString()}`,
      icon: HandHelping,
      color: "bg-green-500",
    },
    {
      title: "Sponsor Remaining Fees",
      value: `₹${(stats?.sponsorRemainingFees || 0).toLocaleString()}`,
      icon: Wallet,
      color: "bg-orange-500",
    },
    {
      title: "Full Sponsored Students",
      value: stats?.fullSponsoredStudents || 0,
      icon: Users2,
      color: "bg-blue-400",
    },
    {
      title: "Semi Sponsored Students",
      value: stats?.semiSponsoredStudents || 0,
      icon: Users2,
      color: "bg-yellow-400",
    },
    {
      title: "Not Sponsored Students",
      value: stats?.notSponsoredStudents || 0,
      icon: Users2,
      color: "bg-red-400",
    },
  ];
  
  
  
   const recentActivities = [
    { title: "New student admission", time: "2 hours ago", type: "admission" },
    { title: "Fee payment received", time: "3 hours ago", type: "payment" },
    { title: "Staff meeting scheduled", time: "5 hours ago", type: "event" },
    { title: "Updated class schedule", time: "1 day ago", type: "update" },
  ];

  const upcomingEvents = [
    { title: "Annual Sports Day", date: "March 15, 2024", type: "sports" },
    {
      title: "Parent-Teacher Meeting",
      date: "March 20, 2024",
      type: "meeting",
    },
    { title: "Science Exhibition", date: "March 25, 2024", type: "exhibition" },
  ];

  const topPerformers = [
    {
      name: "Sarah Johnson",
      grade: "Grade 10",
      score: "98%",
      subject: "Mathematics",
    },
    {
      name: "Michael Chen",
      grade: "Grade 11",
      score: "97%",
      subject: "Physics",
    },
    {
      name: "Emma Davis",
      grade: "Grade 9",
      score: "96%",
      subject: "Literature",
    },
  ];

  return (
    <div className={` ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } bg-white dark:bg-gray-800 shadow-xl z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <School2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold dark:text-white">DUII</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin Dashboard
                </p>
              </div>
            </motion.div>

            <nav className="space-y-2">
              {[
                {
                  icon: UserPlus,
                  label: "New Admission",
                  delay: 0.1,
                  route: "/admin/new-admission",
                },
                {
                  icon: Users,
                  label: "Student Details",
                  delay: 0.2,
                  route: "/admin/students",
                },
                {
                  icon: IndianRupee,
                  label: "Fees",
                  delay: 0.3,
                  route: "/admin/students/payment",
                }, // Added Payments route
              ].map((item, index) => (
                <motion.a
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  whileHover={{ x: 10 }}
                  onClick={() => navigate(item.route)} // Direct navigation based on the route
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Logout Button at Bottom */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 10 }}
            className="mt-auto mb-6 mx-6 flex items-center gap-3 p-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors w-auto"
            onClick={handleLogout} // Attach handleLogout function to the logout button
          >
            <LogOut className="h-5 w-5" />
            Logout
          </motion.button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:ml-72 p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              Welcome Back, Admin!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening today
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              } hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <h3 className="text-xl font-bold dark:text-white">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-bold dark:text-white">
                Recent Activities
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <p className="font-medium dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-bold dark:text-white">
                Upcoming Events
              </h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-900 transition-colors"
                >
                  <p className="font-medium dark:text-white">{event.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.date}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
