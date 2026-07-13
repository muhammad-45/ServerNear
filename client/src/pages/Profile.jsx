import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiAward, FiDollarSign, FiSave, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';
import './Auth.css'; // Leverage common form styling

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    experience: '',
    category: '',
    hourlyRate: '',
    skills: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        bio: user.providerInfo?.bio || '',
        experience: user.providerInfo?.experience || '',
        category: user.providerInfo?.category?._id || user.providerInfo?.category || '',
        hourlyRate: user.providerInfo?.hourlyRate || '',
        skills: user.providerInfo?.skills?.join(', ') || ''
      });
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        city: formData.city
      };

      if (user.role === 'provider') {
        profileData.providerInfo = {
          bio: formData.bio,
          experience: Number(formData.experience) || 0,
          category: formData.category,
          hourlyRate: Number(formData.hourlyRate) || 0,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        };
      }

      const { data } = await API.put('/auth/me', profileData);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match.');
    }
    setPasswordLoading(true);

    try {
      const { data } = await API.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (data.success) {
        toast.success(data.message || 'Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return <Loader text="Loading profile..." />;

  return (
    <div className="container container-sm" style={{ padding: 'var(--space-8) 0' }}>
      <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', border: '1px solid var(--color-border-light)' }}>
        <div className="page-header" style={{ textAlign: 'left', padding: '0 0 var(--space-6) 0', borderBottom: '1px solid var(--color-border)' }}>
          <h1>My Profile</h1>
          <p>Update your personal information and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="profile-form" style={{ marginTop: 'var(--space-6)' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><FiUser size={16} /> Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" id="profile-name" />
            </div>
            <div className="form-group">
              <label className="form-label"><FiMail size={16} /> Email Address (Read-only)</label>
              <input type="email" name="email" value={formData.email} disabled className="form-input" style={{ backgroundColor: 'var(--color-bg-alt)', cursor: 'not-allowed' }} id="profile-email" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><FiPhone size={16} /> Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" id="profile-phone" />
            </div>
            <div className="form-group">
              <label className="form-label"><FiMapPin size={16} /> City</label>
              <select name="city" value={formData.city} onChange={handleChange} required className="form-input" id="profile-city">
                <option value="">Select city</option>
                <option value="Abbottabad">Abbottabad</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
              </select>
            </div>
          </div>

          {/* Provider Fields */}
          {user.role === 'provider' && (
            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Provider Information</h3>
              {user.providerInfo?.isVerified ? (
                <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(42, 157, 143, 0.15)', color: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)', fontWeight: 600, display: 'inline-block' }}>
                  ✓ Verified Account
                </div>
              ) : (
                <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(233, 196, 106, 0.15)', color: '#D4A017', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)', fontWeight: 600, display: 'inline-block' }}>
                  ⚠ Pending Admin Verification
                </div>
              )}

              <div className="form-group">
                <label className="form-label"><FiBriefcase size={16} /> Specialty Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="form-input" id="profile-category">
                  <option value="">Select your specialty</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label"><FiAward size={16} /> Experience (years)</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" required className="form-input" id="profile-experience" />
                </div>
                <div className="form-group">
                  <label className="form-label"><FiDollarSign size={16} /> Hourly Rate (PKR)</label>
                  <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} min="0" required className="form-input" id="profile-rate" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Skills (comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Wiring, AC Repair, Plumbing" className="form-input" id="profile-skills" />
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Description</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="form-input form-textarea" placeholder="Describe your experience and work..." id="profile-bio" />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }} id="profile-submit">
              <FiSave /> {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>

        {/* Change Password Section */}
        <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FiLock size={18} /> Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className="auth-form" id="password-form">
            <div className="form-group">
              <label className="form-label"><FiLock size={16} /> Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="form-input"
                id="password-current"
                placeholder="Enter current password"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><FiLock size={16} /> New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="form-input"
                  id="password-new"
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label className="form-label"><FiLock size={16} /> Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="form-input"
                  id="password-confirm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-primary" disabled={passwordLoading} id="password-submit">
                {passwordLoading ? 'Updating Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
