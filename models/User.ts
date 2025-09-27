import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import ENV from '@/config/env';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  company?: string;
  qrCode?: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı gereklidir'],
    unique: true,
    trim: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
    maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olabilir']
  },
  email: {
    type: String,
    required: [true, 'E-posta gereklidir'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  fullName: {
    type: String,
    required: [true, 'Ad soyad gereklidir'],
    trim: true,
    maxlength: [100, 'Ad soyad en fazla 100 karakter olabilir']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Şirket adı en fazla 100 karakter olabilir']
  },
  qrCode: {
    type: String
  },
  avatar: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Şifre hash'leme middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(ENV.BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// QR kod oluşturma middleware
UserSchema.pre('save', function(next) {
  if (this.isNew) {
    this.qrCode = JSON.stringify({
      userId: this._id,
      username: this.username,
      email: this.email,
      timestamp: Date.now(),
      event: 'diji-fuar-2024'
    });
  }
  next();
});

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// JSON response'dan şifre alanını çıkar
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);