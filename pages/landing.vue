<template>
  <!-- Hero Section -->
  <div class="hero-section">
    <v-container>
      <v-row class="text-center" align="center" style="min-height: 100vh;">
        <v-col>
          <h1 class="hero-title animate__animated animate__fadeInDown">Welcome to AirBalloon Tracker</h1>
          <p class="hero-subtitle animate__animated animate__fadeInUp">Track and participate in hot air balloon races in real-time.</p>
          <v-btn color="primary" to="/" class="cta-button animate__animated animate__pulse animate__infinite" size="x-large">
            Get Started
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- About Section -->
  <div class="about-section">
    <v-container class="py-16">
      <v-row class="text-center">
        <v-col>
          <h2 class="section-title animate__animated animate__fadeInLeft">What is AirBalloon Tracker?</h2>
          <p class="section-text animate__animated animate__fadeInRight">AirBalloon Tracker is an innovative platform that allows you to follow and participate in exciting hot air balloon races in real-time.</p>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- How it Works Section -->
  <div class="how-it-works-section">
    <v-container class="py-16">
      <h2 class="text-center section-title mb-10">How it Works</h2>
      <v-row>
        <v-col v-for="(step, i) in howItWorks" :key="i" cols="12" md="4">
          <v-card class="step-card animate__animated animate__fadeInUp" :style="{ animationDelay: `${i * 0.2}s` }">
            <v-card-text class="text-center">
              <v-icon size="48" color="white" class="mb-4">{{ step.icon }}</v-icon>
              <h3 class="text-h5 mb-4 white--text">{{ step.title }}</h3>
              <p class="white--text">{{ step.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Statistics Section -->
  <div class="stats-section">
    <v-container class="py-16">
      <v-row>
        <v-col v-for="(stat, i) in statistics" :key="i" cols="6" md="3">
          <div class="text-center stat-card">
            <h3 class="text-h3 font-weight-bold">{{ stat.value }}+</h3>
            <p class="text-subtitle-1">{{ stat.label }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Features Section -->
  <div class="features-section">
    <v-container class="py-16">
      <h2 class="text-center section-title mb-10">Main Features</h2>
      <v-row>
        <v-col v-for="(feature, i) in features" :key="i" cols="12" md="6">
          <v-card class="feature-card animate__animated animate__zoomIn" :style="{ animationDelay: `${i * 0.2}s` }">
            <v-icon large color="white">{{ feature.icon }}</v-icon>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Call to Action -->
  <div class="cta-section">
    <v-container class="py-16">
      <v-row class="text-center">
        <v-col>
          <h2 class="section-title mb-6">Ready to Start Your Journey?</h2>
          <v-btn color="primary" size="x-large" to="/" class="cta-button">Launch App</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
const howItWorks = [
  {
    icon: 'mdi-account',
    title: 'Create Account',
    description: 'Connect your MetaMask wallet to get started'
  },
  {
    icon: 'mdi-balloon',
    title: 'Choose Your Balloon',
    description: 'Select from our unique collection of digital balloons'
  },
  {
    icon: 'mdi-map',
    title: 'Join Races',
    description: 'Participate in exciting races across virtual skies'
  }
];

const statistics = [
  { value: '1000', label: 'Active Users' },
  { value: '500', label: 'Races Completed' },
  { value: '100', label: 'Digital Balloons' },
  { value: '50', label: 'Daily Events' }
];

const features = [
  {
    icon: 'mdi-map-marker',
    title: 'Real-time Tracking',
    description: 'Follow hot air balloons as they race across the sky in real-time.'
  },
  {
    icon: 'mdi-trophy',
    title: 'Race Participation',
    description: 'Join exciting races and compete with other participants.'
  },
  {
    icon: 'mdi-lock',
    title: 'Secure Connection',
    description: 'Connect securely with MetaMask to ensure your data is safe.'
  },
  {
    icon: 'mdi-account-circle',
    title: 'User-friendly Interface',
    description: 'Enjoy a seamless and intuitive user experience.'
  }
];
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://placeholder.co/1920x1080') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-title {
  font-size: 4rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 2rem;
}

.about-section {
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://placeholder.co/1920x1080') no-repeat center center;
  background-size: cover;
  color: white;
}

.how-it-works-section {
  background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)), url('https://placeholder.co/1920x1080') no-repeat center center fixed;
  background-size: cover;
  color: white;
}

.stats-section {
  background: linear-gradient(45deg, rgba(63, 81, 181, 0.9), rgba(33, 150, 243, 0.9)), url('https://placeholder.co/1920x1080') no-repeat center center;
  background-size: cover;
  color: white;
}

.features-section {
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://placeholder.co/1920x1080') no-repeat center center fixed;
  background-size: cover;
  color: white;
}

.cta-section {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('https://placeholder.co/1920x1080') no-repeat center center;
  background-size: cover;
  color: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: white;
}

.section-text {
  font-size: 1.2rem;
  color: #fff;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}

.step-card {
  height: 100%;
  transition: transform 0.3s;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
  }
}

.stat-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
}

.feature-card {
  text-align: center;
  padding: 2rem;
  height: 100%;
  transition: transform 0.3s;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  h3 {
    color: white;
    margin: 1rem 0;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
  }
}

.cta-button {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>