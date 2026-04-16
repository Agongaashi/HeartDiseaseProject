# backend/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os
import sys

def train_model():
    """Trajnon modelin duke perdorur te dhenat nga dataset/heart.csv"""
    
    # 🔴 PJESA E NDRYSHUAR - Path-i i saktë për strukturën tënde
    # Ti e ke dataset-in brenda backend/dataset/
    csv_path = 'dataset/heart.csv'  # Ndryshuar nga '../dataset/heart.csv'
    
    # 1️⃣ Kontrollo nese dataset ekziston
    if not os.path.exists(csv_path):
        print(f"❌ Error: Nuk gjendet dataseti ne {csv_path}")
        print(f"📌 Folderi aktual: {os.getcwd()}")
        print("📌 Sigurohu që heart.csv është te backend/dataset/")
        
        # Listo folderet për ndihmë
        if os.path.exists('dataset'):
            print("📌 Folderi 'dataset' ekziston por heart.csv mungon")
        else:
            print("📌 Folderi 'dataset' nuk ekziston!")
            print("   Krijoje me: mkdir dataset")
        sys.exit(1)
    
    # 2️⃣ Lexo datasetin nga CSV
    print(f"📂 Duke lexuar datasetin nga {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"✅ Dataseti u lexua: {df.shape[0]} rreshta, {df.shape[1]} kolona")
    
    # 3️⃣ Shiko kolonat e disponueshme
    print(f"\n📋 Kolonat e gjetura: {list(df.columns)}")
    
    # 4️⃣ Pergatit feature-et (X) dhe target-in (y)
    # Kontrollo nese kolonat ekzistojne
    required_columns = ['age', 'sex', 'blood_pressure', 'cholesterol', 'heart_rate']
    target_column = 'target'
    
    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        print(f"❌ Kolonat qe mungojne: {missing_cols}")
        print("📌 Sigurohu qe CSV ka kolonat e duhura")
        print("📌 Kolonat e kërkuara: age, sex, blood_pressure, cholesterol, heart_rate, target")
        sys.exit(1)
    
    if target_column not in df.columns:
        print(f"❌ Kolona 'target' nuk u gjet!")
        print(f"📌 Kolonat e gjetura: {list(df.columns)}")
        sys.exit(1)
    
    X = df[required_columns]
    y = df[target_column]
    
    # 5️⃣ Nda ne trajnim dhe test
    # Nëse ka pak të dhëna, mos përdor stratify
    if len(df) < 10:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
    
    print(f"\n📊 Dataseti u nda:")
    print(f"   - Trajnim: {X_train.shape[0]} rreshta")
    print(f"   - Test: {X_test.shape[0]} rreshta")
    
    # 6️⃣ Trajno modelin
    print("\n🤖 Duke trajnuar Random Forest modelin...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # 7️⃣ Vlereso modelin
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n✅ Modeli u trajnua!")
    print(f"📈 Saktesia ne test: {accuracy:.2%}")
    
    # Shfaq classification report vetem nëse ka më shumë se 1 klasë në test
    if len(set(y_test)) > 1:
        print(f"\n📊 Classification Report:")
        print(classification_report(y_test, y_pred))
    else:
        print(f"\n⚠️ Vetëm një klasë në grupin e testit, anashkalohet classification report")
    
    # 8️⃣ Ruaj modelin
    os.makedirs('models', exist_ok=True)
    model_path = 'models/ml_model.pkl'
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"\n💾 Modeli u ruajt ne: {model_path}")
    
    # Trego informata shtesë
    print(f"\n📊 Statistikat e modelit:")
    print(f"   - Numri i pemëve: {model.n_estimators}")
    print(f"   - Thellësia maksimale: {model.max_depth}")
    print(f"   - Rëndësia e feature-ve:")
    for col, imp in zip(required_columns, model.feature_importances_):
        print(f"      • {col}: {imp:.3f}")
    
    print("\n🎉 Trajnimi u kompletua me sukses!")

if __name__ == "__main__":
    train_model()