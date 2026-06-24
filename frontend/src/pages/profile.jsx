import React, { useEffect, useMemo, useState } from "react";
import "../css/profile.css";
import "../css/settings.css";
import Toast from "../components/toast";
import { useExpenses } from "../context/ExpenseContext";

export default function Profile() {

    const { expenses, fetchExpenses } = useExpenses();

    const [profile, setProfile] = useState({
        user_name: "",
        user_email: "",
        phone: "",
        country: "",
        created_at: ""
    });

    const [showEditProfileBox, setShowEditProfileBox] = useState(false);
    const [profileEditLoading, setProfileEditLoading] = useState(false);

    const [editProfileData, setEditProfileData] = useState({
        user_name: "",
        user_email: "",
        phone: ""
    });

    const [showPasswordBox, setShowPasswordBox] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [budget, setBudget] = useState(0);

    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastMessageType, setToastMessageType] = useState("success");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const showMessage = (message, type = "success") => {
        setToastMessage(message);
        setToastMessageType(type);
        setShowToast(true);
    };

    const safeJson = async (response) => {
        try {
            return await response.json();
        } catch {
            return {};
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch(
                "http://localhost:1500/user/profile",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            );

            const data = await safeJson(response);

            if (response.ok) {
                setProfile(data.user || data.profile || {});
            } else {
                console.error("Profile fetch error:", data.message);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch(
                "http://localhost:1500/notification/get",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            );

            const data = await safeJson(response);

            if (response.ok) {
                setNotifications(Array.isArray(data) ? data : []);
            } else {
                console.error("Notification fetch error:", data.message);
            }
        } catch (error) {
            console.error("Notification fetch error:", error);
        }
    };

    const fetchBudget = async () => {
        try {
            const response = await fetch(
                "http://localhost:1500/budget/get",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            );

            const data = await safeJson(response);

            if (response.ok && Array.isArray(data) && data.length > 0) {
                setBudget(Number(data[0].budget_amount || 0));
            }
        } catch (error) {
            console.error("Budget fetch error:", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchProfile();
        fetchNotifications();
        fetchBudget();
    }, []);

    const formatCurrency = (value) => {
        return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
    };

    const formatDate = (value) => {
        if (!value) return "Not available";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const totalSpent = useMemo(() => {
        return expenses.reduce(
            (total, expense) => total + Number(expense.amount || 0),
            0
        );
    }, [expenses]);

    const reminders = useMemo(() => {
        return notifications.filter(
            (notification) => notification.type === "reminder"
        );
    }, [notifications]);


    const recentActivity = useMemo(() => {
        const expenseActivities = (expenses || []).map((expense, index) => ({
            id: `expense-${expense.expense_id || expense.id || index}`,
            type: "expense",
            title: expense.title || "Expense added",
            category: expense.category || "Expense",
            amount: Number(expense.amount || 0),
            date:
                expense.created_at ||
                expense.expense_date ||
                expense.date ||
                new Date().toISOString()
        }));

        const notificationMap = new Map();

        (notifications || []).forEach((notification, index) => {
            const notificationId =
                notification.notification_id || notification.id || index;

            const activity = {
                id: `notification-${notificationId}`,
                type: notification.type === "alert" ? "alert" : "reminder",
                title: notification.title || "Notification created",
                category:
                    notification.type === "alert"
                        ? "Bill Alert"
                        : "Reminder",
                amount: Number(notification.amount || 0),
                date:
                    notification.created_at ||
                    notification.notify_date ||
                    notification.date ||
                    new Date().toISOString()
            };

            notificationMap.set(activity.id, activity);
        });

        return [...expenseActivities, ...notificationMap.values()]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6);
    }, [expenses, notifications]);

    const getProfileInitial = () => {
        const name = profile.user_name || profile.full_name || "U";

        return name.charAt(0).toUpperCase();
    };

    const getActivityIcon = (type) => {
        if (type === "alert") {
            return "fa-solid fa-file-invoice-dollar";
        }

        if (type === "reminder") {
            return "fa-solid fa-bell";
        }

        return "fa-solid fa-wallet";
    };

    const getActivityAmount = (activity) => {
        if (
            activity.amount === null ||
            activity.amount === undefined ||
            activity.amount === ""
        ) {
            return null;
        }

        return formatCurrency(activity.amount);
    };

    const refreshProfileData = async () => {
        await Promise.all([
            fetchExpenses(),
            fetchProfile(),
            fetchNotifications(),
            fetchBudget()
        ]);

        showMessage("Profile data refreshed successfully.");
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const updatePassword = async (e) => {
        e.preventDefault();

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            showMessage("Please fill all password fields.", "error");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            showMessage(
                "New password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage("New passwords do not match.", "error");
            return;
        }

        try {
            setPasswordLoading(true);

            const response = await fetch(`http://localhost:1500/user/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(passwordData)
            });

            const data = await safeJson(response);

            if (!response.ok) {
                throw new Error(data.message || "Unable to update password");
            }

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setShowPasswordBox(false);
            showMessage(data.message || "Password updated successfully.");
        } catch (error) {
            showMessage(error.message, "error");
        } finally {
            setPasswordLoading(false);
        }
    };

    const openEditProfile = () => {
        setEditProfileData({
            user_name: profile.user_name || "",
            user_email: profile.user_email || "",
            phone: profile.phone || ""
        });

        setShowEditProfileBox(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!editProfileData.user_name.trim()) {
            showMessage("Name is required.", "error");
            return;
        }

        if (!editProfileData.user_email.trim()) {
            showMessage("Email is required.", "error");
            return;
        }

        try {
            setProfileEditLoading(true);

            const response = await fetch(
                "http://localhost:1500/user/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        user_name: editProfileData.user_name.trim(),
                        user_email: editProfileData.user_email.trim(),
                        phone: editProfileData.phone.trim()
                    })
                }
            );

            const data = await safeJson(response);

            if (!response.ok) {
                showMessage(
                    data.message || "Unable to update profile.",
                    "error"
                );
                return;
            }

            setProfile(data.user);
            setShowEditProfileBox(false);

            showMessage("Profile updated successfully.");
        } catch (error) {
            console.error("Update profile error:", error);
            showMessage("Unable to update profile.", "error");
        } finally {
            setProfileEditLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:1500/user/logout", {
                method: "POST",
                credentials: "include"
            });

            const data = await safeJson(response);

            if (!response.ok) {
                showMessage(data.message || "Unable to logout.", "error");
                return;
            }

            showMessage("Logged out Successfully", "success")
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (error) {
            console.error("Logout error:", error);
            showMessage("Unable to logout.", "error");
        }
    };

    return (
        <div className="profile-page">
            <Toast
                type={toastMessageType}
                message={toastMessage}
                show={showToast}
                setShow={setShowToast}
            />

            <div className="profile-header">
                <div>
                    <span className="profile-eyebrow">MY ACCOUNT</span>

                    <h2>Profile</h2>

                    <p>
                        View your account information, financial overview, and
                        recent activity.
                    </p>
                </div>

                <button
                    type="button"
                    className="profile-refresh-btn logout-profile-btn"
                    onClick={() => setShowConfirmLogout(true)}
                >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                </button>

            </div>

            <section className="profile-hero-card">
                <div className="profile-avatar">
                    <span>{getProfileInitial()}</span>
                </div>

                <div className="profile-main-info">
                    <div className="profile-name-row">
                        <h3>
                            {profile.user_name ||
                                profile.full_name ||
                                "Your Name"}
                        </h3>

                        <span className="profile-active-badge">
                            <i className="fa-solid fa-circle-check"></i>
                            Active
                        </span>
                    </div>

                    <p className="profile-email">
                        <i className="fa-regular fa-envelope"></i>
                        {profile.user_email || "Email not available"}
                    </p>

                    <p className="profile-member">
                        <i className="fa-regular fa-calendar"></i>
                        Member since {formatDate(profile.created_at)}
                    </p>
                </div>

                <div className="profile-hero-actions">
                    <button
                        type="button"
                        className="profile-edit-btn"
                        onClick={() => openEditProfile()}
                    >
                        <i className="fa-solid fa-pen"></i>
                        Edit Profile
                    </button>
                </div>
            </section>

            <section className="profile-stats-grid">
                <div className="profile-stat-card">
                    <div className="profile-stat-icon expense">
                        <i className="fa-solid fa-wallet"></i>
                    </div>

                    <div>
                        <p>Total Expenses</p>
                        <h4>{expenses.length}</h4>
                    </div>
                </div>

                <div className="profile-stat-card">
                    <div className="profile-stat-icon spent">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                    </div>

                    <div>
                        <p>Total Spent</p>
                        <h4>{formatCurrency(totalSpent)}</h4>
                    </div>
                </div>

                <div className="profile-stat-card">
                    <div className="profile-stat-icon reminder">
                        <i className="fa-solid fa-bell"></i>
                    </div>

                    <div>
                        <p>Reminders</p>
                        <h4>{reminders.length}</h4>
                    </div>
                </div>

                <div className="profile-stat-card">
                    <div className="profile-stat-icon alert">
                        <i className="fa-solid fa-file-invoice-dollar"></i>
                    </div>

                    <div>
                        <p>Monthly Budget</p>
                        <h4>{formatCurrency(budget)}</h4>
                    </div>
                </div>
            </section>

            <section className="profile-content-grid">
                <div className="profile-card personal-info-card">
                    <div className="profile-card-heading">
                        <div>
                            <span>PERSONAL DETAILS</span>
                            <h3>Account Information</h3>
                        </div>

                        <i className="fa-regular fa-user"></i>
                    </div>

                    <div className="profile-info-list">
                        <div className="profile-info-item">
                            <div className="profile-info-icon">
                                <i className="fa-regular fa-user"></i>
                            </div>

                            <div>
                                <span>Full Name</span>
                                <strong>
                                    {profile.user_name ||
                                        profile.user_name ||
                                        "Not added"}
                                </strong>
                            </div>
                        </div>

                        <div className="profile-info-item">
                            <div className="profile-info-icon">
                                <i className="fa-regular fa-envelope"></i>
                            </div>

                            <div>
                                <span>Email Address</span>
                                <strong>
                                    {profile.user_email ||
                                        "Not available"}
                                </strong>
                            </div>
                        </div>

                        <div className="profile-info-item">
                            <div className="profile-info-icon">
                                <i className="fa-solid fa-phone"></i>
                            </div>

                            <div>
                                <span>Phone Number</span>
                                <strong>
                                    {profile.phone || "Not added"}
                                </strong>
                            </div>
                        </div>

                        <div className="profile-info-item profile-password-item">
                            <div className="profile-password-content">
                                <div className="profile-info-icon">
                                    <i className="fa-solid fa-key"></i>
                                </div>
                                <div>
                                    <span>Account Password</span>
                                    <strong>Keep your account protected</strong>
                                </div>
                            </div>
                            <button type="button" className="profile-change-password-btn"
                                onClick={() => setShowPasswordBox(true)} > Change Password </button>
                        </div>
                    </div>
                </div>

                <div className="profile-card activity-card">
                    <div className="profile-card-heading">
                        <div>
                            <span>RECENT ACTIVITY</span>
                            <h3>Latest Updates</h3>
                        </div>

                        <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>

                    <div className="profile-activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div
                                    className="profile-activity-item"
                                    key={activity.id}
                                >
                                    <div
                                        className={`profile-activity-icon ${activity.type}`}
                                    >
                                        <i
                                            className={getActivityIcon(
                                                activity.type
                                            )}
                                        ></i>
                                    </div>

                                    <div className="profile-activity-text">
                                        <h5>{activity.title}</h5>

                                        <p>
                                            {activity.category} ·{" "}
                                            {formatDate(activity.date)}
                                        </p>
                                    </div>

                                    {getActivityAmount(activity) && (
                                        <strong>
                                            {getActivityAmount(activity)}
                                        </strong>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="profile-empty-activity">
                                <i className="fa-regular fa-folder-open"></i>
                                <p>No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {showPasswordBox && (
                <div className="delete-account-overlay">
                    <form
                        className="delete-account-box password-modal"
                        onSubmit={updatePassword}
                    >
                        <div className="delete-account-icon security-modal-icon">
                            <i className="fa-solid fa-key"></i>
                        </div>

                        <h3>Change Password</h3>
                        <p>Choose a strong new password for your account.</p>

                        <div className="password-form-fields">
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="Current password"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />

                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="delete-account-actions">
                            <button
                                type="button"
                                className="cancel-delete-btn"
                                onClick={() => setShowPasswordBox(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="confirm-delete-btn security-confirm-btn"
                                disabled={passwordLoading}
                            >
                                {passwordLoading
                                    ? "Updating..."
                                    : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showEditProfileBox && (
                <div className="profile-password-overlay">
                    <div className="profile-password-box">
                        <button
                            type="button"
                            className="profile-password-close"
                            onClick={() => setShowEditProfileBox(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div className="profile-password-header">
                            <div className="profile-password-header-icon">
                                <i className="fa-solid fa-user-pen"></i>
                            </div>

                            <div>
                                <h3>Edit Profile</h3>
                                <p>Update your personal account information.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile}>
                            <div className="profile-password-form-group">
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={editProfileData.user_name}
                                    onChange={(e) =>
                                        setEditProfileData({
                                            ...editProfileData,
                                            user_name: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="profile-password-form-group">
                                <label>Email Address</label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={editProfileData.user_email}
                                    onChange={(e) =>
                                        setEditProfileData({
                                            ...editProfileData,
                                            user_email: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="profile-password-form-group">
                                <label>Phone Number</label>

                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={editProfileData.phone}
                                    onChange={(e) =>
                                        setEditProfileData({
                                            ...editProfileData,
                                            phone: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="profile-password-actions">
                                <button
                                    type="button"
                                    className="profile-password-cancel-btn"
                                    onClick={() => setShowEditProfileBox(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-password-save-btn"
                                    disabled={profileEditLoading}
                                >
                                    {profileEditLoading ? (
                                        <>
                                            Updating...
                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                    ) : (
                                        <>
                                            Save Changes
                                            <i className="fa-solid fa-floppy-disk"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmLogout && (
                <div className="profile-logout-overlay">
                    <div className="profile-logout-box">
                        <div className="profile-logout-icon">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </div>

                        <h3>Logout from your account?</h3>

                        <p>
                            Are you sure you want to logout? You will need to sign in
                            again to access your account.
                        </p>

                        <div className="profile-logout-actions">
                            <button
                                type="button"
                                className="profile-logout-cancel-btn"
                                onClick={() => setShowConfirmLogout(false)}
                                disabled={logoutLoading}
                            >
                                No, Stay Logged In
                            </button>

                            <button
                                type="button"
                                className="profile-logout-confirm-btn"
                                onClick={handleLogout}
                                disabled={logoutLoading}
                            >
                                {logoutLoading ? (
                                    <>
                                        <span className="profile-btn-spinner"></span>
                                        Logging out...
                                    </>
                                ) : (
                                    <>
                                        Yes, Logout
                                        <i className="fa-solid fa-right-from-bracket"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}