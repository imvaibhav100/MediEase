package com.example.backend.service;

import com.example.backend.model.Medicine;
import com.example.backend.repository.MedicineRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GenericFinderService {

    @Autowired
    private MedicineRepository medicineRepository;

    // Known brand to salt composition mapping (comprehensive database)
    private static final Map<String, List<String>> BRAND_SALT_MAP = new HashMap<>();
    
    static {
        // Pain & Fever - WITH DOSAGE
        BRAND_SALT_MAP.put("crocin", List.of("paracetamol 500mg"));
        BRAND_SALT_MAP.put("crocin advance", List.of("paracetamol 500mg"));
        BRAND_SALT_MAP.put("dolo", List.of("paracetamol 650mg"));
        BRAND_SALT_MAP.put("dolo 650", List.of("paracetamol 650mg"));
        BRAND_SALT_MAP.put("calpol", List.of("paracetamol 500mg"));
        BRAND_SALT_MAP.put("paracip", List.of("paracetamol 500mg"));
        BRAND_SALT_MAP.put("pacimol", List.of("paracetamol 650mg"));
        BRAND_SALT_MAP.put("p 500", List.of("paracetamol 500mg"));
        BRAND_SALT_MAP.put("fepanil", List.of("paracetamol 500mg"));
        
        // Combiflam type (Ibuprofen + Paracetamol) - WITH DOSAGE
        BRAND_SALT_MAP.put("combiflam", List.of("ibuprofen 400mg", "paracetamol 325mg"));
        BRAND_SALT_MAP.put("conbiflam", List.of("ibuprofen 400mg", "paracetamol 325mg")); // Common misspelling
        BRAND_SALT_MAP.put("kombiflem", List.of("ibuprofen 400mg", "paracetamol 325mg")); // Common misspelling
        BRAND_SALT_MAP.put("brufen plus", List.of("ibuprofen 400mg", "paracetamol 325mg"));
        BRAND_SALT_MAP.put("ibugesic plus", List.of("ibuprofen 400mg", "paracetamol 325mg"));
        BRAND_SALT_MAP.put("brufen", List.of("ibuprofen 400mg"));
        BRAND_SALT_MAP.put("advil", List.of("ibuprofen 200mg"));
        
        // Zerodol type (Aceclofenac + Paracetamol) - WITH DOSAGE
        BRAND_SALT_MAP.put("zerodol p", List.of("aceclofenac 100mg", "paracetamol 325mg"));
        BRAND_SALT_MAP.put("zerodol sp", List.of("aceclofenac 100mg", "paracetamol 325mg", "serratiopeptidase 15mg"));
        BRAND_SALT_MAP.put("hifenac p", List.of("aceclofenac 100mg", "paracetamol 325mg"));
        BRAND_SALT_MAP.put("ace proxyvon", List.of("aceclofenac 100mg", "paracetamol 325mg"));
        
        // Diclofenac combinations
        BRAND_SALT_MAP.put("voveran", List.of("diclofenac 50mg"));
        BRAND_SALT_MAP.put("voveran sr", List.of("diclofenac"));
        BRAND_SALT_MAP.put("diclogesic", List.of("diclofenac"));
        
        // Topical Pain Relief (Gel/Spray/Cream)
        BRAND_SALT_MAP.put("volini", List.of("diclofenac", "methyl salicylate", "menthol"));
        BRAND_SALT_MAP.put("volini gel", List.of("diclofenac", "methyl salicylate", "menthol"));
        BRAND_SALT_MAP.put("volini spray", List.of("diclofenac", "methyl salicylate", "menthol"));
        BRAND_SALT_MAP.put("moov", List.of("diclofenac", "methyl salicylate", "menthol"));
        BRAND_SALT_MAP.put("iodex", List.of("methyl salicylate", "menthol"));
        BRAND_SALT_MAP.put("tiger balm", List.of("camphor", "menthol", "methyl salicylate"));
        BRAND_SALT_MAP.put("zandu balm", List.of("camphor", "menthol", "methyl salicylate"));
        BRAND_SALT_MAP.put("amrutanjan", List.of("camphor", "menthol"));
        BRAND_SALT_MAP.put("relispray", List.of("diclofenac", "methyl salicylate", "menthol"));
        BRAND_SALT_MAP.put("omnigel", List.of("diclofenac", "methyl salicylate", "menthol", "linseed oil"));
        BRAND_SALT_MAP.put("fastum gel", List.of("ketoprofen"));
        BRAND_SALT_MAP.put("thrombophob", List.of("heparin"));
        
        // Cold & Cough
        BRAND_SALT_MAP.put("sinarest", List.of("paracetamol", "phenylephrine", "chlorpheniramine"));
        BRAND_SALT_MAP.put("sinarest af", List.of("paracetamol", "phenylephrine", "chlorpheniramine"));
        BRAND_SALT_MAP.put("d cold total", List.of("paracetamol", "phenylephrine", "chlorpheniramine", "caffeine"));
        BRAND_SALT_MAP.put("vicks action 500", List.of("paracetamol", "phenylephrine", "caffeine"));
        BRAND_SALT_MAP.put("coldact", List.of("paracetamol", "phenylephrine", "chlorpheniramine"));
        
        // Antiallergy
        BRAND_SALT_MAP.put("cetzine", List.of("cetirizine"));
        BRAND_SALT_MAP.put("zyrtec", List.of("cetirizine"));
        BRAND_SALT_MAP.put("okacet", List.of("cetirizine"));
        BRAND_SALT_MAP.put("allegra", List.of("fexofenadine"));
        BRAND_SALT_MAP.put("allegra 120", List.of("fexofenadine"));
        BRAND_SALT_MAP.put("allegra 180", List.of("fexofenadine"));
        BRAND_SALT_MAP.put("montair lc", List.of("montelukast", "levocetirizine"));
        BRAND_SALT_MAP.put("montek lc", List.of("montelukast", "levocetirizine"));
        BRAND_SALT_MAP.put("levocet", List.of("levocetirizine"));
        BRAND_SALT_MAP.put("xyzal", List.of("levocetirizine"));
        
        // Cough syrups
        BRAND_SALT_MAP.put("benadryl", List.of("diphenhydramine"));
        BRAND_SALT_MAP.put("ascoril", List.of("ambroxol", "guaifenesin", "salbutamol"));
        BRAND_SALT_MAP.put("ascoril d", List.of("ambroxol", "guaifenesin", "dextromethorphan"));
        BRAND_SALT_MAP.put("ambrodil", List.of("ambroxol"));
        BRAND_SALT_MAP.put("grilinctus", List.of("ambroxol", "guaifenesin"));
        BRAND_SALT_MAP.put("alex", List.of("phenylephrine", "chlorpheniramine", "dextromethorphan"));
        
        // Antibiotics
        BRAND_SALT_MAP.put("azithral", List.of("azithromycin"));
        BRAND_SALT_MAP.put("azithral 500", List.of("azithromycin"));
        BRAND_SALT_MAP.put("azee", List.of("azithromycin"));
        BRAND_SALT_MAP.put("zithromax", List.of("azithromycin"));
        BRAND_SALT_MAP.put("augmentin", List.of("amoxicillin", "clavulanic acid"));
        BRAND_SALT_MAP.put("augmentin 625", List.of("amoxicillin", "clavulanic acid"));
        BRAND_SALT_MAP.put("moxikind cv", List.of("amoxicillin", "clavulanic acid"));
        BRAND_SALT_MAP.put("mox", List.of("amoxicillin"));
        BRAND_SALT_MAP.put("amoxil", List.of("amoxicillin"));
        BRAND_SALT_MAP.put("taxim o", List.of("cefixime"));
        BRAND_SALT_MAP.put("taxim", List.of("cefixime"));
        BRAND_SALT_MAP.put("zifi", List.of("cefixime"));
        BRAND_SALT_MAP.put("cefix", List.of("cefixime"));
        BRAND_SALT_MAP.put("ciplox", List.of("ciprofloxacin"));
        BRAND_SALT_MAP.put("ciplox 500", List.of("ciprofloxacin"));
        BRAND_SALT_MAP.put("cifran", List.of("ciprofloxacin"));
        BRAND_SALT_MAP.put("norflox", List.of("norfloxacin"));
        BRAND_SALT_MAP.put("normax", List.of("norfloxacin"));
        BRAND_SALT_MAP.put("flagyl", List.of("metronidazole"));
        BRAND_SALT_MAP.put("flagyl 400", List.of("metronidazole"));
        BRAND_SALT_MAP.put("metrogyl", List.of("metronidazole"));
        BRAND_SALT_MAP.put("doxylin", List.of("doxycycline"));
        BRAND_SALT_MAP.put("doxy 100", List.of("doxycycline"));
        
        // Gastric/Acidity
        BRAND_SALT_MAP.put("omez", List.of("omeprazole"));
        BRAND_SALT_MAP.put("omez 20", List.of("omeprazole"));
        BRAND_SALT_MAP.put("ocid", List.of("omeprazole"));
        BRAND_SALT_MAP.put("pan", List.of("pantoprazole"));
        BRAND_SALT_MAP.put("pan 40", List.of("pantoprazole"));
        BRAND_SALT_MAP.put("pantocid", List.of("pantoprazole"));
        BRAND_SALT_MAP.put("pan d", List.of("pantoprazole", "domperidone"));
        BRAND_SALT_MAP.put("pantocid d", List.of("pantoprazole", "domperidone"));
        BRAND_SALT_MAP.put("rantac", List.of("ranitidine"));
        BRAND_SALT_MAP.put("zinetac", List.of("ranitidine"));
        BRAND_SALT_MAP.put("digene", List.of("aluminium hydroxide", "magnesium hydroxide", "simethicone"));
        BRAND_SALT_MAP.put("gelusil", List.of("aluminium hydroxide", "magnesium hydroxide", "simethicone"));
        BRAND_SALT_MAP.put("mucaine", List.of("aluminium hydroxide", "magnesium hydroxide", "oxetacaine"));
        
        // Antispasmodic
        BRAND_SALT_MAP.put("cyclopam", List.of("dicyclomine", "paracetamol"));
        BRAND_SALT_MAP.put("drotin", List.of("drotaverine"));
        BRAND_SALT_MAP.put("meftal spas", List.of("mefenamic acid", "dicyclomine"));
        BRAND_SALT_MAP.put("buscopan", List.of("hyoscine butylbromide"));
        
        // Anti-diarrheal
        BRAND_SALT_MAP.put("electral", List.of("oral rehydration salts"));
        BRAND_SALT_MAP.put("ors", List.of("oral rehydration salts"));
        BRAND_SALT_MAP.put("enterogermina", List.of("bacillus clausii"));
        BRAND_SALT_MAP.put("econorm", List.of("saccharomyces boulardii"));
        BRAND_SALT_MAP.put("loperamide", List.of("loperamide"));
        BRAND_SALT_MAP.put("imodium", List.of("loperamide"));
        
        // Diabetes
        BRAND_SALT_MAP.put("glycomet", List.of("metformin"));
        BRAND_SALT_MAP.put("glucophage", List.of("metformin"));
        BRAND_SALT_MAP.put("glycomet gp", List.of("metformin", "glimepiride"));
        BRAND_SALT_MAP.put("amaryl", List.of("glimepiride"));
        BRAND_SALT_MAP.put("januvia", List.of("sitagliptin"));
        BRAND_SALT_MAP.put("jalra", List.of("vildagliptin"));
        BRAND_SALT_MAP.put("galvus", List.of("vildagliptin"));
        
        // Blood Pressure - WITH EXACT DOSAGE FOR SAFETY
        BRAND_SALT_MAP.put("amlodipine", List.of("amlodipine 5mg"));
        BRAND_SALT_MAP.put("amlodipine 5", List.of("amlodipine 5mg"));
        BRAND_SALT_MAP.put("amlodipine 10", List.of("amlodipine 10mg"));
        BRAND_SALT_MAP.put("amlong", List.of("amlodipine 5mg"));
        BRAND_SALT_MAP.put("amlong 5", List.of("amlodipine 5mg"));
        BRAND_SALT_MAP.put("amlong 10", List.of("amlodipine 10mg"));
        BRAND_SALT_MAP.put("stamlo", List.of("amlodipine 5mg"));
        BRAND_SALT_MAP.put("stamlo 5", List.of("amlodipine 5mg"));
        BRAND_SALT_MAP.put("stamlo 10", List.of("amlodipine 10mg"));
        
        // Telmisartan with exact dosages
        BRAND_SALT_MAP.put("telma", List.of("telmisartan 40mg"));
        BRAND_SALT_MAP.put("telma 20", List.of("telmisartan 20mg"));
        BRAND_SALT_MAP.put("telma 40", List.of("telmisartan 40mg"));
        BRAND_SALT_MAP.put("telma 80", List.of("telmisartan 80mg"));
        BRAND_SALT_MAP.put("telmikind", List.of("telmisartan 40mg"));
        BRAND_SALT_MAP.put("telmikind 20", List.of("telmisartan 20mg"));
        BRAND_SALT_MAP.put("telmikind 40", List.of("telmisartan 40mg"));
        BRAND_SALT_MAP.put("telmikind 80", List.of("telmisartan 80mg"));
        BRAND_SALT_MAP.put("telma h", List.of("telmisartan 40mg", "hydrochlorothiazide 12.5mg"));
        BRAND_SALT_MAP.put("telma h 40", List.of("telmisartan 40mg", "hydrochlorothiazide 12.5mg"));
        BRAND_SALT_MAP.put("telma h 80", List.of("telmisartan 80mg", "hydrochlorothiazide 12.5mg"));
        
        // ZEBLONG - Telmisartan + Azelnidipine combinations WITH EXACT DOSAGE
        BRAND_SALT_MAP.put("zeblong", List.of("azelnidipine 8mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong t", List.of("azelnidipine 8mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong t 8", List.of("azelnidipine 8mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong t 8/40", List.of("azelnidipine 8mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong t 16", List.of("azelnidipine 16mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong t 16/40", List.of("azelnidipine 16mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong 8", List.of("azelnidipine 8mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong 16", List.of("azelnidipine 16mg", "telmisartan 40mg"));
        BRAND_SALT_MAP.put("zeblong 16/40", List.of("azelnidipine 16mg", "telmisartan 40mg"));
        
        // More Azelnidipine combinations
        BRAND_SALT_MAP.put("azelnidipine", List.of("azelnidipine 8mg"));
        BRAND_SALT_MAP.put("azelnidipine 8", List.of("azelnidipine 8mg"));
        BRAND_SALT_MAP.put("azelnidipine 16", List.of("azelnidipine 16mg"));
        BRAND_SALT_MAP.put("azovas", List.of("azelnidipine 8mg"));
        BRAND_SALT_MAP.put("azovas 8", List.of("azelnidipine 8mg"));
        BRAND_SALT_MAP.put("azovas 16", List.of("azelnidipine 16mg"));
        
        BRAND_SALT_MAP.put("atenolol", List.of("atenolol 50mg"));
        BRAND_SALT_MAP.put("atenolol 25", List.of("atenolol 25mg"));
        BRAND_SALT_MAP.put("atenolol 50", List.of("atenolol 50mg"));
        BRAND_SALT_MAP.put("atenolol 100", List.of("atenolol 100mg"));
        BRAND_SALT_MAP.put("betacard", List.of("atenolol 50mg"));
        BRAND_SALT_MAP.put("betacard 25", List.of("atenolol 25mg"));
        BRAND_SALT_MAP.put("betacard 50", List.of("atenolol 50mg"));
        BRAND_SALT_MAP.put("betacard 100", List.of("atenolol 100mg"));
        BRAND_SALT_MAP.put("met xl", List.of("metoprolol 25mg"));
        BRAND_SALT_MAP.put("met xl 25", List.of("metoprolol 25mg"));
        BRAND_SALT_MAP.put("met xl 50", List.of("metoprolol 50mg"));
        BRAND_SALT_MAP.put("met xl 100", List.of("metoprolol 100mg"));
        BRAND_SALT_MAP.put("betaloc", List.of("metoprolol 50mg"));
        BRAND_SALT_MAP.put("losartan", List.of("losartan 50mg"));
        BRAND_SALT_MAP.put("losartan 25", List.of("losartan 25mg"));
        BRAND_SALT_MAP.put("losartan 50", List.of("losartan 50mg"));
        BRAND_SALT_MAP.put("losartan 100", List.of("losartan 100mg"));
        BRAND_SALT_MAP.put("losar", List.of("losartan 50mg"));
        BRAND_SALT_MAP.put("losar 25", List.of("losartan 25mg"));
        BRAND_SALT_MAP.put("losar 50", List.of("losartan 50mg"));
        BRAND_SALT_MAP.put("repace", List.of("losartan 50mg"));
        BRAND_SALT_MAP.put("repace 25", List.of("losartan 25mg"));
        BRAND_SALT_MAP.put("repace 50", List.of("losartan 50mg"));
        
        // Cholesterol
        BRAND_SALT_MAP.put("atorvastatin", List.of("atorvastatin"));
        BRAND_SALT_MAP.put("atorva", List.of("atorvastatin"));
        BRAND_SALT_MAP.put("lipitor", List.of("atorvastatin"));
        BRAND_SALT_MAP.put("rosuvastatin", List.of("rosuvastatin"));
        BRAND_SALT_MAP.put("rosuvas", List.of("rosuvastatin"));
        BRAND_SALT_MAP.put("crestor", List.of("rosuvastatin"));
        
        // Vitamins/Supplements
        BRAND_SALT_MAP.put("becosules", List.of("vitamin b complex"));
        BRAND_SALT_MAP.put("neurobion forte", List.of("vitamin b1", "vitamin b6", "vitamin b12"));
        BRAND_SALT_MAP.put("shelcal", List.of("calcium", "vitamin d3"));
        BRAND_SALT_MAP.put("shelcal 500", List.of("calcium", "vitamin d3"));
        BRAND_SALT_MAP.put("calcimax", List.of("calcium", "vitamin d3"));
        BRAND_SALT_MAP.put("limcee", List.of("vitamin c"));
        BRAND_SALT_MAP.put("celin", List.of("vitamin c"));
        BRAND_SALT_MAP.put("evion", List.of("vitamin e"));
        BRAND_SALT_MAP.put("evion 400", List.of("vitamin e"));
        BRAND_SALT_MAP.put("zincovit", List.of("multivitamin", "zinc"));
        BRAND_SALT_MAP.put("revital", List.of("multivitamin", "ginseng"));
        BRAND_SALT_MAP.put("supradyn", List.of("multivitamin", "minerals"));
        BRAND_SALT_MAP.put("dexorange", List.of("ferric ammonium citrate", "folic acid", "vitamin b12"));
        BRAND_SALT_MAP.put("livogen", List.of("ferrous fumarate", "folic acid"));
        
        // Topical/Ointments (Note: volini, moov, iodex, zandu balm already defined above)
        BRAND_SALT_MAP.put("betadine", List.of("povidone iodine"));
        BRAND_SALT_MAP.put("soframycin", List.of("framycetin"));
        BRAND_SALT_MAP.put("neosporin", List.of("neomycin", "bacitracin", "polymyxin b"));
        BRAND_SALT_MAP.put("candid", List.of("clotrimazole"));
        BRAND_SALT_MAP.put("clocip", List.of("clotrimazole"));
        
        // Antiemetic
        BRAND_SALT_MAP.put("emeset", List.of("ondansetron"));
        BRAND_SALT_MAP.put("vomistop", List.of("domperidone"));
        BRAND_SALT_MAP.put("domstal", List.of("domperidone"));
        BRAND_SALT_MAP.put("avomine", List.of("promethazine"));
        
        // Sleep/Anxiety
        BRAND_SALT_MAP.put("alprax", List.of("alprazolam"));
        BRAND_SALT_MAP.put("restyl", List.of("alprazolam"));
        BRAND_SALT_MAP.put("ativan", List.of("lorazepam"));
        BRAND_SALT_MAP.put("clonotril", List.of("clonazepam"));
        
        // More common brands
        BRAND_SALT_MAP.put("disprin", List.of("aspirin"));
        BRAND_SALT_MAP.put("ecosprin", List.of("aspirin"));
        BRAND_SALT_MAP.put("aspirin", List.of("aspirin"));
        BRAND_SALT_MAP.put("nimesulide", List.of("nimesulide"));
        BRAND_SALT_MAP.put("nise", List.of("nimesulide"));
        BRAND_SALT_MAP.put("nice", List.of("nimesulide"));
        BRAND_SALT_MAP.put("sumo", List.of("nimesulide", "paracetamol"));
        
        // Cough Syrups - More
        BRAND_SALT_MAP.put("zedex", List.of("dextromethorphan", "chlorpheniramine", "phenylephrine"));
        BRAND_SALT_MAP.put("zedex sf", List.of("dextromethorphan", "chlorpheniramine", "phenylephrine"));
        BRAND_SALT_MAP.put("corex", List.of("codeine", "chlorpheniramine"));
        BRAND_SALT_MAP.put("codistar", List.of("codeine", "chlorpheniramine"));
        BRAND_SALT_MAP.put("phensedyl", List.of("codeine", "promethazine", "ephedrine"));
        BRAND_SALT_MAP.put("tixylix", List.of("pholcodine", "promethazine"));
        BRAND_SALT_MAP.put("kofex", List.of("dextromethorphan", "chlorpheniramine"));
        BRAND_SALT_MAP.put("tusq dx", List.of("dextromethorphan", "phenylephrine", "chlorpheniramine"));
        BRAND_SALT_MAP.put("torex", List.of("dextromethorphan", "phenylephrine", "chlorpheniramine"));
        BRAND_SALT_MAP.put("cofsils", List.of("dextromethorphan", "menthol"));
        BRAND_SALT_MAP.put("honitus", List.of("honey", "tulsi"));
        BRAND_SALT_MAP.put("chericof", List.of("dextromethorphan", "chlorpheniramine", "phenylephrine"));
        
        // Eye drops
        BRAND_SALT_MAP.put("itone", List.of("naphazoline", "chlorpheniramine"));
        BRAND_SALT_MAP.put("refresh tears", List.of("carboxymethylcellulose"));
        BRAND_SALT_MAP.put("tears plus", List.of("polyvinyl alcohol", "povidone"));
        BRAND_SALT_MAP.put("moxiflox", List.of("moxifloxacin"));
        BRAND_SALT_MAP.put("ciplox d", List.of("ciprofloxacin", "dexamethasone"));
        
        // Ear drops
        BRAND_SALT_MAP.put("waxol", List.of("benzocaine", "chlorbutol"));
        BRAND_SALT_MAP.put("otorex", List.of("ofloxacin", "clotrimazole"));
        
        // Nasal
        BRAND_SALT_MAP.put("otrivin", List.of("xylometazoline 0.1%"));
        BRAND_SALT_MAP.put("nasivion", List.of("oxymetazoline 0.05%"));
        BRAND_SALT_MAP.put("sinex", List.of("oxymetazoline 0.05%"));
        
        // Inhalers / Respiratory - WITH DOSAGE
        BRAND_SALT_MAP.put("tiova", List.of("tiotropium bromide 18mcg"));
        BRAND_SALT_MAP.put("tiova inhaler", List.of("tiotropium bromide 18mcg"));
        BRAND_SALT_MAP.put("tiova rotacap", List.of("tiotropium bromide 18mcg"));
        BRAND_SALT_MAP.put("spiriva", List.of("tiotropium bromide 18mcg"));
        BRAND_SALT_MAP.put("braltus", List.of("tiotropium bromide 18mcg"));
        BRAND_SALT_MAP.put("duolin", List.of("ipratropium bromide 500mcg", "levosalbutamol 1.25mg"));
        BRAND_SALT_MAP.put("duolin respules", List.of("ipratropium bromide 500mcg", "levosalbutamol 1.25mg"));
        BRAND_SALT_MAP.put("budecort", List.of("budesonide 100mcg"));
        BRAND_SALT_MAP.put("budecort 200", List.of("budesonide 200mcg"));
        BRAND_SALT_MAP.put("foracort", List.of("budesonide 200mcg", "formoterol 6mcg"));
        BRAND_SALT_MAP.put("foracort 200", List.of("budesonide 200mcg", "formoterol 6mcg"));
        BRAND_SALT_MAP.put("foracort 400", List.of("budesonide 400mcg", "formoterol 6mcg"));
        BRAND_SALT_MAP.put("seroflo", List.of("fluticasone 250mcg", "salmeterol 50mcg"));
        BRAND_SALT_MAP.put("seroflo 125", List.of("fluticasone 125mcg", "salmeterol 25mcg"));
        BRAND_SALT_MAP.put("seroflo 250", List.of("fluticasone 250mcg", "salmeterol 50mcg"));
        BRAND_SALT_MAP.put("asthalin", List.of("salbutamol 100mcg"));
        BRAND_SALT_MAP.put("asthalin inhaler", List.of("salbutamol 100mcg"));
        BRAND_SALT_MAP.put("levolin", List.of("levosalbutamol 50mcg"));
        BRAND_SALT_MAP.put("serobid", List.of("salmeterol 25mcg"));
        BRAND_SALT_MAP.put("salmeter", List.of("salmeterol 25mcg"));
        BRAND_SALT_MAP.put("onbrez", List.of("indacaterol 150mcg"));
        BRAND_SALT_MAP.put("ultibro", List.of("indacaterol 110mcg", "glycopyrronium 50mcg"));
        
        // Skin/Derma
        BRAND_SALT_MAP.put("betnovate", List.of("betamethasone 0.1%"));
        BRAND_SALT_MAP.put("betnovate c", List.of("betamethasone 0.1%", "clioquinol 3%"));
        BRAND_SALT_MAP.put("betnovate n", List.of("betamethasone 0.1%", "neomycin 0.5%"));
        BRAND_SALT_MAP.put("fourderm", List.of("clobetasol 0.05%", "miconazole 2%", "neomycin 0.5%", "chlorhexidine 1%"));
        BRAND_SALT_MAP.put("quadriderm", List.of("betamethasone", "gentamicin", "tolnaftate", "clioquinol"));
        BRAND_SALT_MAP.put("lobate", List.of("clobetasol 0.05%"));
        BRAND_SALT_MAP.put("tenovate", List.of("clobetasol 0.05%"));
        BRAND_SALT_MAP.put("dermibest", List.of("clobetasol 0.05%", "neomycin 0.5%", "miconazole 2%"));
        BRAND_SALT_MAP.put("panderm", List.of("clobetasol 0.05%", "neomycin 0.5%", "miconazole 2%"));
        BRAND_SALT_MAP.put("canesten", List.of("clotrimazole 1%"));
        BRAND_SALT_MAP.put("ring guard", List.of("miconazole 2%"));
        BRAND_SALT_MAP.put("fungid", List.of("fluconazole 150mg"));
        BRAND_SALT_MAP.put("flucos", List.of("fluconazole 150mg"));
        
        // Anti-Epileptic / Neurological - WITH DOSAGE
        BRAND_SALT_MAP.put("encorate", List.of("sodium valproate 200mg"));
        BRAND_SALT_MAP.put("encorate chrono", List.of("sodium valproate 200mg", "valproic acid 87mg"));
        BRAND_SALT_MAP.put("encorate chrono 200", List.of("sodium valproate 133.4mg", "valproic acid 58mg"));
        BRAND_SALT_MAP.put("encorate chrono 300", List.of("sodium valproate 200mg", "valproic acid 87mg"));
        BRAND_SALT_MAP.put("encorate chrono 500", List.of("sodium valproate 333mg", "valproic acid 145mg"));
        BRAND_SALT_MAP.put("valparin", List.of("sodium valproate 200mg"));
        BRAND_SALT_MAP.put("valparin chrono", List.of("sodium valproate 300mg", "valproic acid 130mg"));
        BRAND_SALT_MAP.put("epilex", List.of("sodium valproate 200mg"));
        BRAND_SALT_MAP.put("torvate", List.of("sodium valproate 500mg"));
        BRAND_SALT_MAP.put("tegrital", List.of("carbamazepine 200mg"));
        BRAND_SALT_MAP.put("tegretol", List.of("carbamazepine"));
        BRAND_SALT_MAP.put("zen retard", List.of("carbamazepine"));
        BRAND_SALT_MAP.put("mazetol", List.of("carbamazepine"));
        BRAND_SALT_MAP.put("oxetol", List.of("oxcarbazepine"));
        BRAND_SALT_MAP.put("trileptal", List.of("oxcarbazepine"));
        BRAND_SALT_MAP.put("frisium", List.of("clobazam"));
        BRAND_SALT_MAP.put("cloba", List.of("clobazam"));
        BRAND_SALT_MAP.put("epitril", List.of("clonazepam"));
        BRAND_SALT_MAP.put("rivotril", List.of("clonazepam"));
        BRAND_SALT_MAP.put("petril", List.of("clonazepam"));
        BRAND_SALT_MAP.put("levipil", List.of("levetiracetam"));
        BRAND_SALT_MAP.put("levera", List.of("levetiracetam"));
        BRAND_SALT_MAP.put("keppra", List.of("levetiracetam"));
        BRAND_SALT_MAP.put("topamax", List.of("topiramate"));
        BRAND_SALT_MAP.put("topamac", List.of("topiramate"));
        BRAND_SALT_MAP.put("epitop", List.of("topiramate"));
        BRAND_SALT_MAP.put("lamitor", List.of("lamotrigine"));
        BRAND_SALT_MAP.put("lamictal", List.of("lamotrigine"));
        BRAND_SALT_MAP.put("lametec", List.of("lamotrigine"));
        BRAND_SALT_MAP.put("gabapin", List.of("gabapentin"));
        BRAND_SALT_MAP.put("neurontin", List.of("gabapentin"));
        BRAND_SALT_MAP.put("gabantin", List.of("gabapentin"));
        BRAND_SALT_MAP.put("pregabalin", List.of("pregabalin"));
        BRAND_SALT_MAP.put("lyrica", List.of("pregabalin"));
        BRAND_SALT_MAP.put("pregalin", List.of("pregabalin"));
        BRAND_SALT_MAP.put("pregaba", List.of("pregabalin"));
        
        // Psychiatric / Mental Health
        BRAND_SALT_MAP.put("nexito", List.of("escitalopram"));
        BRAND_SALT_MAP.put("cipralex", List.of("escitalopram"));
        BRAND_SALT_MAP.put("stalopam", List.of("escitalopram"));
        BRAND_SALT_MAP.put("feliz s", List.of("escitalopram"));
        BRAND_SALT_MAP.put("prodep", List.of("fluoxetine"));
        BRAND_SALT_MAP.put("prozac", List.of("fluoxetine"));
        BRAND_SALT_MAP.put("fludac", List.of("fluoxetine"));
        BRAND_SALT_MAP.put("sertraline", List.of("sertraline"));
        BRAND_SALT_MAP.put("zoloft", List.of("sertraline"));
        BRAND_SALT_MAP.put("serta", List.of("sertraline"));
        BRAND_SALT_MAP.put("daxid", List.of("sertraline"));
        BRAND_SALT_MAP.put("oleanz", List.of("olanzapine"));
        BRAND_SALT_MAP.put("olanex", List.of("olanzapine"));
        BRAND_SALT_MAP.put("zyprexa", List.of("olanzapine"));
        BRAND_SALT_MAP.put("risperdal", List.of("risperidone"));
        BRAND_SALT_MAP.put("risdone", List.of("risperidone"));
        BRAND_SALT_MAP.put("sizodon", List.of("risperidone"));
        BRAND_SALT_MAP.put("qutan", List.of("quetiapine"));
        BRAND_SALT_MAP.put("seroquel", List.of("quetiapine"));
        BRAND_SALT_MAP.put("qutipin", List.of("quetiapine"));
        BRAND_SALT_MAP.put("arip mt", List.of("aripiprazole"));
        BRAND_SALT_MAP.put("abilify", List.of("aripiprazole"));
        BRAND_SALT_MAP.put("asprito", List.of("aripiprazole"));
        
        // Thyroid
        BRAND_SALT_MAP.put("thyronorm", List.of("levothyroxine"));
        BRAND_SALT_MAP.put("eltroxin", List.of("levothyroxine"));
        BRAND_SALT_MAP.put("thyrox", List.of("levothyroxine"));
        BRAND_SALT_MAP.put("thyrofit", List.of("levothyroxine"));
        BRAND_SALT_MAP.put("neomercazole", List.of("carbimazole"));
        BRAND_SALT_MAP.put("anti thyrox", List.of("carbimazole"));
        
        // More Antibiotics
        BRAND_SALT_MAP.put("doxycycline", List.of("doxycycline"));
        BRAND_SALT_MAP.put("doxt sl", List.of("doxycycline"));
        BRAND_SALT_MAP.put("doxy 1", List.of("doxycycline"));
        BRAND_SALT_MAP.put("tetracycline", List.of("tetracycline"));
        BRAND_SALT_MAP.put("metrogyl", List.of("metronidazole"));
        BRAND_SALT_MAP.put("flagyl", List.of("metronidazole"));
        BRAND_SALT_MAP.put("metronidazole", List.of("metronidazole"));
        BRAND_SALT_MAP.put("norflox", List.of("norfloxacin"));
        BRAND_SALT_MAP.put("norflox tz", List.of("norfloxacin", "tinidazole"));
        BRAND_SALT_MAP.put("ornidazole", List.of("ornidazole"));
        BRAND_SALT_MAP.put("o2", List.of("ofloxacin", "ornidazole"));
        BRAND_SALT_MAP.put("oflox oz", List.of("ofloxacin", "ornidazole"));
        BRAND_SALT_MAP.put("zenflox oz", List.of("ofloxacin", "ornidazole"));
        BRAND_SALT_MAP.put("cefpodoxime", List.of("cefpodoxime"));
        BRAND_SALT_MAP.put("cepodem", List.of("cefpodoxime"));
        BRAND_SALT_MAP.put("mahacef", List.of("cefixime"));
        BRAND_SALT_MAP.put("taxim", List.of("cefotaxime"));
        BRAND_SALT_MAP.put("clavam", List.of("amoxicillin", "clavulanic acid"));
        BRAND_SALT_MAP.put("augmentin", List.of("amoxicillin", "clavulanic acid"));
        
        // More Gastric
        BRAND_SALT_MAP.put("nexpro", List.of("esomeprazole"));
        BRAND_SALT_MAP.put("nexium", List.of("esomeprazole"));
        BRAND_SALT_MAP.put("sompraz", List.of("esomeprazole"));
        BRAND_SALT_MAP.put("esomeprazole", List.of("esomeprazole"));
        BRAND_SALT_MAP.put("nexpro rd", List.of("esomeprazole", "domperidone"));
        BRAND_SALT_MAP.put("sucralfate", List.of("sucralfate"));
        BRAND_SALT_MAP.put("sucrafil", List.of("sucralfate"));
        BRAND_SALT_MAP.put("antacid", List.of("aluminium hydroxide", "magnesium hydroxide"));
        
        // More Heart/BP
        BRAND_SALT_MAP.put("metoprolol", List.of("metoprolol"));
        BRAND_SALT_MAP.put("betaloc", List.of("metoprolol"));
        BRAND_SALT_MAP.put("met xl", List.of("metoprolol"));
        BRAND_SALT_MAP.put("atenolol", List.of("atenolol"));
        BRAND_SALT_MAP.put("tenormin", List.of("atenolol"));
        BRAND_SALT_MAP.put("aten", List.of("atenolol"));
        BRAND_SALT_MAP.put("propranolol", List.of("propranolol"));
        BRAND_SALT_MAP.put("inderal", List.of("propranolol"));
        BRAND_SALT_MAP.put("ciplar", List.of("propranolol"));
        BRAND_SALT_MAP.put("nebicard", List.of("nebivolol"));
        BRAND_SALT_MAP.put("nebilet", List.of("nebivolol"));
        BRAND_SALT_MAP.put("concor", List.of("bisoprolol"));
        BRAND_SALT_MAP.put("bisoprolol", List.of("bisoprolol"));
        BRAND_SALT_MAP.put("ramipril", List.of("ramipril"));
        BRAND_SALT_MAP.put("cardace", List.of("ramipril"));
        BRAND_SALT_MAP.put("enalapril", List.of("enalapril"));
        BRAND_SALT_MAP.put("envas", List.of("enalapril"));
        BRAND_SALT_MAP.put("losartan", List.of("losartan"));
        BRAND_SALT_MAP.put("losacar", List.of("losartan"));
        BRAND_SALT_MAP.put("repace", List.of("losartan"));
        BRAND_SALT_MAP.put("olmesartan", List.of("olmesartan"));
        BRAND_SALT_MAP.put("olmy", List.of("olmesartan"));
        BRAND_SALT_MAP.put("benicar", List.of("olmesartan"));
        BRAND_SALT_MAP.put("diltiazem", List.of("diltiazem"));
        BRAND_SALT_MAP.put("dilzem", List.of("diltiazem"));
        BRAND_SALT_MAP.put("verapamil", List.of("verapamil"));
        BRAND_SALT_MAP.put("calaptin", List.of("verapamil"));
        BRAND_SALT_MAP.put("nitroglycerin", List.of("nitroglycerin"));
        BRAND_SALT_MAP.put("sorbitrate", List.of("isosorbide dinitrate"));
        BRAND_SALT_MAP.put("isordil", List.of("isosorbide dinitrate"));
        
        // Cholesterol
        BRAND_SALT_MAP.put("rosuvastatin", List.of("rosuvastatin"));
        BRAND_SALT_MAP.put("rosuvas", List.of("rosuvastatin"));
        BRAND_SALT_MAP.put("crestor", List.of("rosuvastatin"));
        BRAND_SALT_MAP.put("rozavel", List.of("rosuvastatin"));
        BRAND_SALT_MAP.put("storvas", List.of("atorvastatin"));
        BRAND_SALT_MAP.put("lipitor", List.of("atorvastatin"));
        BRAND_SALT_MAP.put("atorlip", List.of("atorvastatin"));
        BRAND_SALT_MAP.put("simvastatin", List.of("simvastatin"));
        BRAND_SALT_MAP.put("zocor", List.of("simvastatin"));
        
        // More Diabetes
        BRAND_SALT_MAP.put("gliclazide", List.of("gliclazide"));
        BRAND_SALT_MAP.put("diamicron", List.of("gliclazide"));
        BRAND_SALT_MAP.put("glizid", List.of("gliclazide"));
        BRAND_SALT_MAP.put("glipizide", List.of("glipizide"));
        BRAND_SALT_MAP.put("glucotrol", List.of("glipizide"));
        BRAND_SALT_MAP.put("gemer", List.of("glimepiride", "metformin"));
        BRAND_SALT_MAP.put("gluconorm", List.of("glimepiride", "metformin"));
        BRAND_SALT_MAP.put("voglibose", List.of("voglibose"));
        BRAND_SALT_MAP.put("volix", List.of("voglibose"));
        BRAND_SALT_MAP.put("ppg", List.of("voglibose"));
        BRAND_SALT_MAP.put("pioglitazone", List.of("pioglitazone"));
        BRAND_SALT_MAP.put("pioz", List.of("pioglitazone"));
        BRAND_SALT_MAP.put("jardiance", List.of("empagliflozin"));
        BRAND_SALT_MAP.put("forxiga", List.of("dapagliflozin"));
        BRAND_SALT_MAP.put("invokana", List.of("canagliflozin"));
        BRAND_SALT_MAP.put("victoza", List.of("liraglutide"));
        BRAND_SALT_MAP.put("ozempic", List.of("semaglutide"));
        
        // Urology
        BRAND_SALT_MAP.put("urimax", List.of("tamsulosin"));
        BRAND_SALT_MAP.put("flomax", List.of("tamsulosin"));
        BRAND_SALT_MAP.put("veltam", List.of("tamsulosin"));
        BRAND_SALT_MAP.put("silodal", List.of("silodosin"));
        BRAND_SALT_MAP.put("silofast", List.of("silodosin"));
        BRAND_SALT_MAP.put("alfoo", List.of("alfuzosin"));
        BRAND_SALT_MAP.put("finasteride", List.of("finasteride"));
        BRAND_SALT_MAP.put("finpecia", List.of("finasteride"));
        BRAND_SALT_MAP.put("finast", List.of("finasteride"));
        BRAND_SALT_MAP.put("dutasteride", List.of("dutasteride"));
        BRAND_SALT_MAP.put("dutas", List.of("dutasteride"));
        BRAND_SALT_MAP.put("avodart", List.of("dutasteride"));
        
        // Bones/Calcium
        BRAND_SALT_MAP.put("shelcal 500", List.of("calcium", "vitamin d3"));
        BRAND_SALT_MAP.put("shelcal hd", List.of("calcium", "vitamin d3"));
        BRAND_SALT_MAP.put("calcimax forte", List.of("calcium", "vitamin d3"));
        BRAND_SALT_MAP.put("gemcal", List.of("calcium", "vitamin d3"));
        BRAND_SALT_MAP.put("alendronate", List.of("alendronic acid"));
        BRAND_SALT_MAP.put("fosamax", List.of("alendronic acid"));
        BRAND_SALT_MAP.put("osteofos", List.of("alendronic acid"));
        
        // Epilepsy/Seizure - Sodium Valproate
        BRAND_SALT_MAP.put("encorate", List.of("sodium valproate", "valproic acid"));
        BRAND_SALT_MAP.put("encorate chrono", List.of("sodium valproate", "valproic acid"));
        BRAND_SALT_MAP.put("encorate chrono 200", List.of("sodium valproate", "valproic acid"));
        BRAND_SALT_MAP.put("encorate chrono 300", List.of("sodium valproate", "valproic acid"));
        BRAND_SALT_MAP.put("encorate chrono 500", List.of("sodium valproate", "valproic acid"));
        BRAND_SALT_MAP.put("valparin", List.of("sodium valproate"));
        BRAND_SALT_MAP.put("valparin chrono", List.of("sodium valproate", "valproic acid"));
        BRAND_SALT_MAP.put("valance", List.of("sodium valproate"));
        BRAND_SALT_MAP.put("epilex chrono", List.of("sodium valproate", "valproic acid"));
        
        // More Epilepsy medicines
        BRAND_SALT_MAP.put("levipil", List.of("levetiracetam"));
        BRAND_SALT_MAP.put("levera", List.of("levetiracetam"));
        BRAND_SALT_MAP.put("keppra", List.of("levetiracetam"));
        BRAND_SALT_MAP.put("torvate", List.of("divalproex"));
        BRAND_SALT_MAP.put("divaa", List.of("divalproex"));
        BRAND_SALT_MAP.put("depakote", List.of("divalproex"));
        BRAND_SALT_MAP.put("tegretol", List.of("carbamazepine"));
        BRAND_SALT_MAP.put("zen retard", List.of("carbamazepine"));
        BRAND_SALT_MAP.put("mazetol", List.of("carbamazepine"));
        BRAND_SALT_MAP.put("oxetol", List.of("oxcarbazepine"));
        BRAND_SALT_MAP.put("trileptal", List.of("oxcarbazepine"));
        BRAND_SALT_MAP.put("eptoin", List.of("phenytoin"));
        BRAND_SALT_MAP.put("dilantin", List.of("phenytoin"));
        BRAND_SALT_MAP.put("gardenal", List.of("phenobarbital"));
        BRAND_SALT_MAP.put("lamitor", List.of("lamotrigine"));
        BRAND_SALT_MAP.put("lamictal", List.of("lamotrigine"));
        BRAND_SALT_MAP.put("topamax", List.of("topiramate"));
        BRAND_SALT_MAP.put("topamac", List.of("topiramate"));
        
        // Psychiatric medicines
        BRAND_SALT_MAP.put("oleanz", List.of("olanzapine"));
        BRAND_SALT_MAP.put("zyprexa", List.of("olanzapine"));
        BRAND_SALT_MAP.put("olipar", List.of("olanzapine"));
        BRAND_SALT_MAP.put("risperidone", List.of("risperidone"));
        BRAND_SALT_MAP.put("risperdal", List.of("risperidone"));
        BRAND_SALT_MAP.put("sizodon", List.of("risperidone"));
        BRAND_SALT_MAP.put("quetiapine", List.of("quetiapine"));
        BRAND_SALT_MAP.put("seroquel", List.of("quetiapine"));
        BRAND_SALT_MAP.put("qutan", List.of("quetiapine"));
        BRAND_SALT_MAP.put("aripiprazole", List.of("aripiprazole"));
        BRAND_SALT_MAP.put("abilify", List.of("aripiprazole"));
        BRAND_SALT_MAP.put("arip mt", List.of("aripiprazole"));
    }

    /**
     * Main method: Find generic alternatives for a branded medicine
     * 1. Get salt composition via web scraping from 1mg.com (with dosage)
     * 2. Search database for generics with EXACT same salt composition
     * 3. Return alternatives or "not found" message
     */
    public GenericSearchResult findGenericAlternatives(String brandedMedicineName) {
        GenericSearchResult result = new GenericSearchResult();
        result.setBrandedMedicine(brandedMedicineName);
        
        // Normalize input - remove extra spaces, convert to lowercase for matching
        String normalizedInput = brandedMedicineName.trim().toLowerCase().replaceAll("\\s+", " ");
        
        // Get salt composition via web scraping (always from 1mg.com for accurate dosage)
        List<String> salts = getVerifiedSaltComposition(normalizedInput);
        
        if (salts == null || salts.isEmpty()) {
            result.setSaltComposition(null);
            result.setGenericAlternatives(Collections.emptyList());
            result.setMessage("⚠️ '" + brandedMedicineName + "' not found. We tried 1mg.com but couldn't find the composition. Please check the spelling.");
            result.setFound(false);
            result.setVerified(false);
            return result;
        }
        
        result.setVerified(true); // From 1mg.com web scraping
        result.setSaltComposition(salts);
        
        // Step 2: Search for generic alternatives in our database
        List<Medicine> alternatives = searchGenericsBySalt(salts);
        
        if (alternatives.isEmpty()) {
            result.setGenericAlternatives(Collections.emptyList());
            result.setMessage("Salt found: " + String.join(" + ", salts) + " (from 1mg.com) - but no generic alternative in our database yet.");
            result.setFound(false);
            return result;
        }
        
        // Sort by price (cheapest first)
        alternatives.sort(Comparator.comparingDouble(Medicine::getPrice));
        
        result.setGenericAlternatives(alternatives);
        result.setMessage("✅ Found " + alternatives.size() + " generic alternative(s) for " + brandedMedicineName + " (composition from 1mg.com)");
        result.setFound(true);
        
        return result;
    }
    
    /**
     * Get salt composition ONLY from web scraping (1mg.com)
     * This ensures we always get salt WITH DOSAGE QUANTITY
     */
    private List<String> getVerifiedSaltComposition(String brandName) {
        // ALWAYS use web scraping for salt composition with dosage
        System.out.println("[GenericFinder] 🌐 Web scraping for salt with dosage: " + brandName);
        
        List<String> scrapedSalts = scrapeFromWeb(brandName);
        if (scrapedSalts != null && !scrapedSalts.isEmpty()) {
            return scrapedSalts;
        }
        
        // Try without trailing numbers/dosage in name
        String normalizedName = brandName.replaceAll("\\d+\\s*(mg|ml|gm|g|mcg)?$", "").trim();
        if (!normalizedName.equals(brandName)) {
            System.out.println("[GenericFinder] 🔄 Retrying with normalized name: " + normalizedName);
            scrapedSalts = scrapeFromWeb(normalizedName);
            if (scrapedSalts != null && !scrapedSalts.isEmpty()) {
                return scrapedSalts;
            }
        }
        
        // No match found
        return null;
    }

    /**
     * Get salt composition ONLY from web scraping (1mg.com)
     * No database lookup - pure web scraping
     */
    public List<String> getSaltComposition(String brandName) {
        String normalizedName = brandName.trim().toLowerCase()
                .replaceAll("\\s+", " ")
                .replaceAll("\\d+\\s*(mg|ml|gm|g|mcg)$", "")
                .trim();
        
        // ONLY web scraping - no database lookup
        System.out.println("[GenericFinderService] 🌐 Web scraping for salt: " + brandName);
        
        List<String> scrapedSalts = scrapeFromWeb(brandName);
        if (scrapedSalts != null && !scrapedSalts.isEmpty()) {
            return scrapedSalts;
        }
        
        // Try without numbers
        scrapedSalts = scrapeFromWeb(normalizedName);
        if (scrapedSalts != null && !scrapedSalts.isEmpty()) {
            return scrapedSalts;
        }
        
        return List.of("not found");
    }

    // Cache for scraped salts (avoid repeated scraping)
    private static final Map<String, List<String>> scrapedSaltCache = new java.util.concurrent.ConcurrentHashMap<>();

    /**
     * Scrape salt composition from 1mg.com with improved selectors
     * Caches results to avoid repeated scraping
     */
    private List<String> scrapeFromWeb(String brandName) {
        String cacheKey = brandName.toLowerCase().trim();
        
        // Check cache first
        if (scrapedSaltCache.containsKey(cacheKey)) {
            System.out.println("[Scraper] 📦 Cache hit for: " + brandName);
            return scrapedSaltCache.get(cacheKey);
        }
        
        try {
            System.out.println("[Scraper] 🌐 Scraping 1mg.com for: " + brandName);
            
            // Try 1mg search
            String searchUrl = "https://www.1mg.com/search/all?name=" + java.net.URLEncoder.encode(brandName, "UTF-8");
            Document doc = Jsoup.connect(searchUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.9")
                    .header("Referer", "https://www.1mg.com/")
                    .timeout(15000)
                    .followRedirects(true)
                    .get();
            
            // Try to find first product link and navigate to it
            Element firstProduct = doc.selectFirst("a[href*='/drugs/']");
            if (firstProduct != null) {
                String productUrl = firstProduct.attr("href");
                if (!productUrl.startsWith("http")) {
                    productUrl = "https://www.1mg.com" + productUrl;
                }
                
                System.out.println("[Scraper] 📄 Found product: " + productUrl);
                
                Document productDoc = Jsoup.connect(productUrl)
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                        .header("Accept-Language", "en-US,en;q=0.9")
                        .timeout(15000)
                        .followRedirects(true)
                        .get();
                
                List<String> salts = extractSaltFrom1mgPage(productDoc);
                
                if (salts != null && !salts.isEmpty()) {
                    // Cache the result
                    scrapedSaltCache.put(cacheKey, salts);
                    System.out.println("[Scraper] ✅ Found salts: " + salts);
                    return salts;
                }
            }
            
            // If no drug found, try OTC products
            Element otcProduct = doc.selectFirst("a[href*='/otc/']");
            if (otcProduct != null) {
                String productUrl = otcProduct.attr("href");
                if (!productUrl.startsWith("http")) {
                    productUrl = "https://www.1mg.com" + productUrl;
                }
                
                Document productDoc = Jsoup.connect(productUrl)
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                        .timeout(15000)
                        .get();
                
                List<String> salts = extractSaltFrom1mgPage(productDoc);
                if (salts != null && !salts.isEmpty()) {
                    scrapedSaltCache.put(cacheKey, salts);
                    return salts;
                }
            }
            
        } catch (Exception e) {
            System.out.println("[Scraper] ❌ Web scraping failed: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * Extract salt composition WITH DOSAGE from 1mg product page
     * This is critical for patient safety - dosage must be accurate!
     */
    private List<String> extractSaltFrom1mgPage(Document doc) {
        System.out.println("[Scraper] 🔍 Extracting salt with dosage from page...");
        
        // Multiple selectors to try (1mg changes their HTML frequently)
        String[] selectors = {
            // Current 1mg selectors - most specific first
            "div[class*='DrugOverview__content'] div[class*='saltInfo']",
            "div[class*='saltInfo'] a",
            "div[class*='saltInfo']",
            "div[class*='salt-composition']",
            "div[class*='SaltComposition']",
            "div[class*='DrugOverview__salt']",
            "div[class*='saltComposition']",
            // Look for composition in medicine info sections
            "div[class*='MedicineOverview'] span[class*='salt']",
            "div[class*='DrugHeader'] div[class*='salt']",
            // Generic data attributes
            "[data-test='salt-composition']",
            "[class*='salt'][class*='info']"
        };
        
        for (String selector : selectors) {
            Element saltElement = doc.selectFirst(selector);
            if (saltElement != null) {
                String saltText = saltElement.text().trim();
                System.out.println("[Scraper] 📝 Found with selector '" + selector + "': " + saltText);
                if (!saltText.isEmpty() && saltText.length() > 2) {
                    List<String> parsed = parseSaltsWithDosage(saltText);
                    if (parsed != null && !parsed.isEmpty()) {
                        System.out.println("[Scraper] ✅ Parsed salts with dosage: " + parsed);
                        return parsed;
                    }
                }
            }
        }
        
        // Try to find salt in anchor tags (1mg often links salts)
        for (Element anchor : doc.select("a[href*='/generics/']")) {
            String saltText = anchor.text().trim();
            if (!saltText.isEmpty() && saltText.length() > 3) {
                // Check if parent has dosage info
                Element parent = anchor.parent();
                if (parent != null) {
                    String fullText = parent.text().trim();
                    System.out.println("[Scraper] 📝 Found in anchor parent: " + fullText);
                    List<String> parsed = parseSaltsWithDosage(fullText);
                    if (parsed != null && !parsed.isEmpty()) {
                        return parsed;
                    }
                }
            }
        }
        
        // Fallback: Look for "Composition" section
        for (Element el : doc.select("div, span, p, td")) {
            String text = el.text().toLowerCase();
            if (text.contains("composition") || text.contains("salt composition")) {
                // Get the text that contains dosage pattern
                String fullText = el.text();
                System.out.println("[Scraper] 📝 Found composition section: " + fullText);
                
                // Look for pattern like "Drug Name 10mg" or "Drug 10g per 15ml"
                java.util.regex.Pattern dosagePattern = java.util.regex.Pattern.compile(
                    "([A-Za-z][A-Za-z\\s-]+?)\\s*(\\d+\\.?\\d*\\s*(?:mg|g|ml|mcg|%|iu|units?|per\\s*\\d+\\s*ml))",
                    java.util.regex.Pattern.CASE_INSENSITIVE
                );
                java.util.regex.Matcher matcher = dosagePattern.matcher(fullText);
                
                List<String> saltsWithDosage = new ArrayList<>();
                while (matcher.find()) {
                    String saltName = matcher.group(1).trim();
                    String dosage = matcher.group(2).trim();
                    // Filter out common non-salt words
                    if (!saltName.toLowerCase().matches(".*\\b(tablet|capsule|syrup|injection|salt|composition|contains|each|per)\\b.*")) {
                        saltsWithDosage.add(saltName.toLowerCase() + " " + dosage.toLowerCase());
                    }
                }
                
                if (!saltsWithDosage.isEmpty()) {
                    System.out.println("[Scraper] ✅ Extracted with dosage: " + saltsWithDosage);
                    return saltsWithDosage;
                }
            }
        }
        
        // Last resort: Search entire page for salt + dosage pattern
        String pageText = doc.text();
        
        // Pattern to find "SaltName 10mg" or "SaltName 10g/15ml" patterns
        java.util.regex.Pattern saltDosagePattern = java.util.regex.Pattern.compile(
            "(?:Salt\\s*(?:Composition)?|Composition|Contains)[:\\s]*([A-Za-z][A-Za-z\\s-]+?\\s*\\d+\\.?\\d*\\s*(?:mg|g|ml|mcg|%|iu)(?:\\s*(?:per|/)\\s*\\d+\\s*(?:mg|g|ml))?(?:\\s*[+,]\\s*[A-Za-z][A-Za-z\\s-]+?\\s*\\d+\\.?\\d*\\s*(?:mg|g|ml|mcg|%|iu)(?:\\s*(?:per|/)\\s*\\d+\\s*(?:mg|g|ml))?)*)",
            java.util.regex.Pattern.CASE_INSENSITIVE
        );
        java.util.regex.Matcher matcher = saltDosagePattern.matcher(pageText);
        if (matcher.find()) {
            String found = matcher.group(1);
            System.out.println("[Scraper] 📝 Regex found: " + found);
            List<String> parsed = parseSaltsWithDosage(found);
            if (parsed != null && !parsed.isEmpty()) {
                return parsed;
            }
        }
        
        // If still nothing, try simple salt name extraction (without dosage as last resort)
        System.out.println("[Scraper] ⚠️ Could not find dosage, trying simple extraction...");
        for (String selector : selectors) {
            Element saltElement = doc.selectFirst(selector);
            if (saltElement != null) {
                String saltText = saltElement.text().trim();
                if (!saltText.isEmpty()) {
                    List<String> parsed = parseSalts(saltText);
                    if (parsed != null && !parsed.isEmpty()) {
                        // Mark that dosage is unknown
                        List<String> withWarning = new ArrayList<>();
                        for (String salt : parsed) {
                            withWarning.add(salt + " (dosage unknown)");
                        }
                        return withWarning;
                    }
                }
            }
        }
        
        return null;
    }
    
    /**
     * Parse salt string keeping EXACT dosage information
     * Example: "Lactulose 10g per 15ml" -> ["lactulose 10g per 15ml"]
     */
    private List<String> parseSaltsWithDosage(String saltString) {
        if (saltString == null || saltString.isEmpty()) return null;
        
        System.out.println("[Scraper] 🔧 Parsing with dosage: " + saltString);
        
        // Split by + or , but keep dosage attached
        String[] parts = saltString.split("\\s*[+]\\s*|\\s*,\\s*(?=[A-Za-z])");
        List<String> salts = new ArrayList<>();
        
        for (String part : parts) {
            String cleaned = part.trim()
                    .replaceAll("^(salt\\s*:?|composition\\s*:?|contains\\s*:?)\\s*", "") // Remove prefix
                    .replaceAll("\\s+", " ")     // Normalize spaces
                    .trim();
            
            // Skip if it's just common words
            if (cleaned.toLowerCase().matches("^(tablet|capsule|syrup|injection|each|per|of|and|the|ip|bp|usp)s?$")) {
                continue;
            }
            
            if (!cleaned.isEmpty() && cleaned.length() > 2) {
                // Check if it has dosage, if not try to find from original
                if (!cleaned.matches(".*\\d+.*")) {
                    // No dosage found, keep as is but log warning
                    System.out.println("[Scraper] ⚠️ No dosage found for: " + cleaned);
                }
                salts.add(cleaned.toLowerCase());
            }
        }
        
        return salts.isEmpty() ? null : salts;
    }

    /**
     * Parse salt string into list - KEEPS dosage information
     */
    private List<String> parseSalts(String saltString) {
        if (saltString == null || saltString.isEmpty()) return null;
        
        // Split by + or , and clean up
        String[] parts = saltString.split("[+,]");
        List<String> salts = new ArrayList<>();
        for (String part : parts) {
            String cleaned = part.trim()
                    .replaceAll("\\(.*?\\)", "") // Remove parentheses content only
                    .replaceAll("\\s+", " ")     // Normalize spaces
                    .trim()
                    .toLowerCase();
            if (!cleaned.isEmpty() && cleaned.length() > 2) {
                salts.add(cleaned);
            }
        }
        return salts.isEmpty() ? null : salts;
    }
    
    /**
     * Parse salt string - removes dosage (for database matching)
     */
    private List<String> parseSaltsForMatching(String saltString) {
        if (saltString == null || saltString.isEmpty()) return null;
        
        String[] parts = saltString.split("[+,]");
        List<String> salts = new ArrayList<>();
        for (String part : parts) {
            String cleaned = part.trim()
                    .replaceAll("\\d+\\.?\\d*\\s*(mg|ml|gm|g|mcg|%|iu|units?)", "")
                    .replaceAll("\\(.*?\\)", "")
                    .replaceAll("\\s+", " ")
                    .trim()
                    .toLowerCase();
            if (!cleaned.isEmpty() && cleaned.length() > 2) {
                salts.add(cleaned);
            }
        }
        return salts.isEmpty() ? null : salts;
    }

    /**
     * Search generic medicines from MongoDB by salt composition
     * STRICT MATCHING: Only returns medicines with EXACT same salt composition AND DOSAGE
     * This ensures patient safety - no wrong medicines shown
     */
    private List<Medicine> searchGenericsBySalt(List<String> salts) {
        if (salts == null || salts.isEmpty()) {
            return new ArrayList<>();
        }
        
        System.out.println("[GenericFinder] 🔍 EXACT MATCH search for salts WITH DOSAGE: " + salts);
        
        // Keep original salts WITH dosage for strict matching
        List<String> originalSearchSalts = salts.stream()
            .map(s -> s.toLowerCase().trim())
            .filter(s -> s.length() >= 2)
            .sorted()
            .collect(Collectors.toList());
        
        // Also create normalized salts (without dosage) for database lookup
        List<String> normalizedSearchSalts = salts.stream()
            .map(s -> extractSaltName(s))
            .filter(s -> s.length() >= 2)
            .sorted()
            .collect(Collectors.toList());
        
        if (normalizedSearchSalts.isEmpty()) {
            return new ArrayList<>();
        }
        
        String searchSaltKey = String.join("+", originalSearchSalts);
        System.out.println("[GenericFinder] 🔑 Search key WITH DOSAGE: " + searchSaltKey);
        
        List<Medicine> exactMatches = new ArrayList<>();
        List<Medicine> dosageMismatchWarning = new ArrayList<>();
        
        try {
            // Get all potential matches from MongoDB (using salt names, ignoring dosage)
            Set<Medicine> candidates = new HashSet<>();
            
            for (String salt : normalizedSearchSalts) {
                List<Medicine> found = medicineRepository.findBySaltOrNameContaining(salt);
                if (found != null) {
                    candidates.addAll(found);
                }
            }
            
            // Also check in-memory CSV map
            List<Medicine> csvMatches = MedicineService.findBySalts(salts);
            if (csvMatches != null) {
                candidates.addAll(csvMatches);
            }
            
            System.out.println("[GenericFinder] 📋 Total candidates: " + candidates.size());
            
            // Filter for EXACT matches only - NOW WITH DOSAGE CHECK
            for (Medicine med : candidates) {
                if (med.getSalts() == null || med.getSalts().isEmpty()) {
                    continue;
                }
                
                // Keep medicine salts WITH dosage for comparison
                List<String> medSaltsOriginal = med.getSalts().stream()
                    .map(s -> s.toLowerCase().trim())
                    .filter(s -> s.length() >= 2)
                    .sorted()
                    .collect(Collectors.toList());
                
                // Also get normalized (without dosage) for fallback
                List<String> medSaltsNormalized = med.getSalts().stream()
                    .map(s -> extractSaltName(s))
                    .filter(s -> s.length() >= 2)
                    .sorted()
                    .collect(Collectors.toList());
                
                // STRICT MATCH: Check salt names AND dosages match
                if (isExactSaltMatchWithDosage(originalSearchSalts, medSaltsOriginal)) {
                    exactMatches.add(med);
                    System.out.println("[GenericFinder] ✅ EXACT MATCH (with dosage): " + med.getName());
                } 
                // Salt names match but dosage is different - WARNING
                else if (isExactSaltMatch(normalizedSearchSalts, medSaltsNormalized)) {
                    // Check if dosages are present and different
                    boolean hasDosageMismatch = hasDosageMismatch(originalSearchSalts, medSaltsOriginal);
                    if (hasDosageMismatch) {
                        System.out.println("[GenericFinder] ⚠️ DOSAGE MISMATCH - NOT showing: " + med.getName());
                        // Don't add to results - wrong dosage is dangerous!
                    } else {
                        // Salts match, no dosage conflict
                        exactMatches.add(med);
                        System.out.println("[GenericFinder] ✅ Salt match (no dosage conflict): " + med.getName());
                    }
                }
            }
            
            System.out.println("[GenericFinder] 📊 Safe matches: " + exactMatches.size());
            
            // Only return exact matches - NEVER show wrong dosage medicines
            List<Medicine> results;
            if (!exactMatches.isEmpty()) {
                results = exactMatches;
            } else {
                System.out.println("[GenericFinder] ⚠️ No safe matches found with correct dosage");
                return new ArrayList<>();
            }
            
            // Remove duplicates and sort by EXACT composition match first, then price
            Set<String> seen = new HashSet<>();
            
            // Mark medicines with exact composition match
            final List<String> finalOriginalSearchSalts = originalSearchSalts;
            
            results = results.stream()
                .filter(m -> m.getPrice() > 0) // Only show in-stock items
                .filter(m -> seen.add(m.getName().toLowerCase()))
                .sorted((m1, m2) -> {
                    // First priority: Exact composition match (including dosage)
                    boolean m1ExactMatch = isExactCompositionMatch(m1, finalOriginalSearchSalts);
                    boolean m2ExactMatch = isExactCompositionMatch(m2, finalOriginalSearchSalts);
                    
                    if (m1ExactMatch && !m2ExactMatch) return -1;
                    if (!m1ExactMatch && m2ExactMatch) return 1;
                    
                    // If both are exact or both are not, sort by price
                    return Double.compare(m1.getPrice(), m2.getPrice());
                })
                .collect(Collectors.toList());
            
            return results;
            
        } catch (Exception e) {
            System.out.println("[GenericFinder] ❌ Search error: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    /**
     * Check if medicine has EXACT composition match including dosage
     * Used for sorting - exact matches come first
     */
    private boolean isExactCompositionMatch(Medicine med, List<String> searchSalts) {
        if (med.getSalts() == null || med.getSalts().isEmpty()) {
            return false;
        }
        
        List<String> medSalts = med.getSalts().stream()
            .map(s -> s.toLowerCase().trim())
            .sorted()
            .collect(Collectors.toList());
        
        // Check if all search salts (with dosage) match medicine salts
        for (String searchSalt : searchSalts) {
            String searchName = extractSaltName(searchSalt);
            String searchDosage = extractDosage(searchSalt);
            
            boolean foundExact = false;
            for (String medSalt : medSalts) {
                String medName = extractSaltName(medSalt);
                String medDosage = extractDosage(medSalt);
                
                if (areSaltNamesSimilar(searchName, medName)) {
                    // If both have dosage, they must match exactly
                    if (!searchDosage.isEmpty() && !medDosage.isEmpty()) {
                        if (searchDosage.equals(medDosage)) {
                            foundExact = true;
                            break;
                        }
                    } else if (searchDosage.isEmpty() && medDosage.isEmpty()) {
                        foundExact = true;
                        break;
                    }
                }
            }
            if (!foundExact) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Check if two salt lists are EXACTLY the same (without dosage check)
     */
    private boolean isExactSaltMatch(List<String> searchSalts, List<String> medicineSalts) {
        if (searchSalts.size() != medicineSalts.size()) {
            return false;
        }
        
        // Both lists should be sorted already
        for (int i = 0; i < searchSalts.size(); i++) {
            String searchSalt = searchSalts.get(i);
            String medSalt = medicineSalts.get(i);
            
            // Check if salts are essentially the same (salt name only)
            if (!areSaltNamesSimilar(searchSalt, medSalt)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Check if two salt lists match INCLUDING DOSAGE - SAFETY CRITICAL
     */
    private boolean isExactSaltMatchWithDosage(List<String> searchSalts, List<String> medicineSalts) {
        if (searchSalts.size() != medicineSalts.size()) {
            return false;
        }
        
        // Match each search salt with a medicine salt
        List<String> remainingMedSalts = new ArrayList<>(medicineSalts);
        
        for (String searchSalt : searchSalts) {
            boolean foundMatch = false;
            String matchedMedSalt = null;
            
            String searchName = extractSaltName(searchSalt);
            String searchDosage = extractDosage(searchSalt);
            
            for (String medSalt : remainingMedSalts) {
                String medName = extractSaltName(medSalt);
                String medDosage = extractDosage(medSalt);
                
                // Salt names must match
                if (!areSaltNamesSimilar(searchName, medName)) {
                    continue;
                }
                
                // If search has dosage, medicine MUST have same dosage
                if (!searchDosage.isEmpty() && !medDosage.isEmpty()) {
                    if (searchDosage.equals(medDosage)) {
                        foundMatch = true;
                        matchedMedSalt = medSalt;
                        break;
                    }
                    // Dosage mismatch - continue looking
                } else {
                    // One or both don't have dosage - accept match
                    foundMatch = true;
                    matchedMedSalt = medSalt;
                    break;
                }
            }
            
            if (!foundMatch) {
                return false;
            }
            remainingMedSalts.remove(matchedMedSalt);
        }
        
        return true;
    }
    
    /**
     * Check if there's a DANGEROUS dosage mismatch between salts
     * Returns true if same salt names but different dosages
     */
    private boolean hasDosageMismatch(List<String> searchSalts, List<String> medicineSalts) {
        for (String searchSalt : searchSalts) {
            String searchName = extractSaltName(searchSalt);
            String searchDosage = extractDosage(searchSalt);
            
            // Skip if no dosage in search
            if (searchDosage.isEmpty()) continue;
            
            for (String medSalt : medicineSalts) {
                String medName = extractSaltName(medSalt);
                String medDosage = extractDosage(medSalt);
                
                // Same salt name?
                if (areSaltNamesSimilar(searchName, medName)) {
                    // If medicine has dosage and it's different - MISMATCH!
                    if (!medDosage.isEmpty() && !searchDosage.equals(medDosage)) {
                        System.out.println("[GenericFinder] ⚠️ DOSAGE MISMATCH: " + 
                            searchName + " " + searchDosage + " vs " + medDosage);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    /**
     * Check if two salt NAMES are similar (ignores dosage)
     */
    private boolean areSaltNamesSimilar(String salt1, String salt2) {
        if (salt1 == null || salt2 == null) return false;
        
        String name1 = extractSaltName(salt1);
        String name2 = extractSaltName(salt2);
        
        if (name1.equals(name2)) return true;
        if (name1.contains(name2) || name2.contains(name1)) return true;
        
        // Remove common suffixes and compare
        String clean1 = name1.replaceAll("(hydrochloride|sodium|potassium|bromide|dihydrate|fumarate|maleate)$", "").trim();
        String clean2 = name2.replaceAll("(hydrochloride|sodium|potassium|bromide|dihydrate|fumarate|maleate)$", "").trim();
        
        if (clean1.equals(clean2)) return true;
        if (clean1.contains(clean2) || clean2.contains(clean1)) return true;
        
        return false;
    }
    
    /**
     * Check if medicine contains ALL search salts
     */
    private boolean containsAllSalts(List<String> medicineSalts, List<String> searchSalts) {
        for (String searchSalt : searchSalts) {
            boolean found = false;
            for (String medSalt : medicineSalts) {
                if (areSaltsSimilar(searchSalt, medSalt)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Check if two salt names are similar (handles variations)
     * NOW ALSO CHECKS DOSAGE MATCH for safety!
     */
    private boolean areSaltsSimilar(String salt1, String salt2) {
        if (salt1 == null || salt2 == null) return false;
        
        // Exact match
        if (salt1.equals(salt2)) return true;
        
        // Extract salt name and dosage separately
        String name1 = extractSaltName(salt1);
        String name2 = extractSaltName(salt2);
        String dosage1 = extractDosage(salt1);
        String dosage2 = extractDosage(salt2);
        
        // Salt names must match
        boolean namesMatch = name1.equals(name2) || 
                            name1.contains(name2) || 
                            name2.contains(name1);
        
        if (!namesMatch) {
            // Try removing common suffixes
            String clean1 = name1.replaceAll("(hydrochloride|sodium|potassium|bromide|dihydrate|fumarate|maleate)$", "").trim();
            String clean2 = name2.replaceAll("(hydrochloride|sodium|potassium|bromide|dihydrate|fumarate|maleate)$", "").trim();
            namesMatch = clean1.equals(clean2) || clean1.contains(clean2) || clean2.contains(clean1);
        }
        
        if (!namesMatch) return false;
        
        // If both have dosages, they MUST match for safety
        if (!dosage1.isEmpty() && !dosage2.isEmpty()) {
            return dosage1.equals(dosage2);
        }
        
        // If only one has dosage, that's okay (partial info)
        return true;
    }
    
    /**
     * Extract just the salt name without dosage
     */
    private String extractSaltName(String salt) {
        if (salt == null) return "";
        return salt.toLowerCase()
                .replaceAll("\\d+\\.?\\d*\\s*(mg|ml|gm|g|mcg|%|iu|units?)", "")
                .replaceAll("\\(.*?\\)", "")
                .replaceAll("[^a-z\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
    
    /**
     * Extract dosage from salt string (e.g., "paracetamol 500mg" -> "500mg")
     */
    private String extractDosage(String salt) {
        if (salt == null) return "";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(\\d+\\.?\\d*)\\s*(mg|ml|gm|g|mcg|%|iu|units?)", 
            java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher matcher = pattern.matcher(salt.toLowerCase());
        if (matcher.find()) {
            return matcher.group(1) + matcher.group(2).toLowerCase();
        }
        return "";
    }
    
    /**
     * Normalize salt name for matching - removes dosage and extra info
     */
    private String normalizeSaltForMatching(String salt) {
        if (salt == null) return "";
        return salt.toLowerCase()
                .replaceAll("\\d+\\.?\\d*\\s*(mg|ml|gm|g|mcg|%|iu|units?)", "") // Remove dosage
                .replaceAll("\\(.*?\\)", "") // Remove parentheses content
                .replaceAll("(ip|bp|usp|tablets?|capsules?|syrup|injection|oral|solution|powder|rotacaps?|inhaler)", "")
                .replaceAll("[^a-z\\s]", " ") // Keep only letters and spaces
                .replaceAll("\\s+", " ") // Normalize spaces
                .trim();
    }
    
    /**
     * Check if brand name exists in local BRAND_SALT_MAP database
     * Uses same matching logic as getVerifiedSaltComposition
     */
    private boolean checkIfInLocalDb(String brandName) {
        if (brandName == null) return false;
        
        String normalizedName = brandName.toLowerCase().trim();
        
        // Direct match
        if (BRAND_SALT_MAP.containsKey(normalizedName)) {
            return true;
        }
        
        // Remove suffixes like " inhaler", " rotacap", etc.
        String[] formSuffixes = {" inhaler", " rotacaps", " rotacap", " respules", " nebulizer", 
                                  " tablet", " tablets", " capsule", " capsules", " syrup", " injection"};
        for (String suffix : formSuffixes) {
            if (normalizedName.endsWith(suffix)) {
                String withoutSuffix = normalizedName.replace(suffix, "").trim();
                if (BRAND_SALT_MAP.containsKey(withoutSuffix)) {
                    return true;
                }
            }
        }
        
        // Remove strength suffixes
        String[] strengthSuffixes = {" 500", " 650", " 400", " 200", " 100", " 250", " 50", " 25", " 10", " 5"};
        for (String suffix : strengthSuffixes) {
            String withoutSuffix = normalizedName.replace(suffix, "").trim();
            if (BRAND_SALT_MAP.containsKey(withoutSuffix)) {
                return true;
            }
        }
        
        // Check if any brand_salt_map key contains normalizedName or vice versa
        for (String key : BRAND_SALT_MAP.keySet()) {
            if (key.contains(normalizedName) || normalizedName.contains(key)) {
                return true;
            }
        }
        
        // First word match
        String firstWord = normalizedName.split("\\s+")[0];
        if (firstWord.length() >= 4 && BRAND_SALT_MAP.containsKey(firstWord)) {
            return true;
        }
        
        return false;
    }

    /**
     * Result class for generic search
     */
    public static class GenericSearchResult {
        private String brandedMedicine;
        private List<String> saltComposition;
        private List<Medicine> genericAlternatives;
        private String message;
        private boolean found;
        private boolean verified; // Whether salt composition is from verified database

        // Getters and Setters
        public String getBrandedMedicine() { return brandedMedicine; }
        public void setBrandedMedicine(String brandedMedicine) { this.brandedMedicine = brandedMedicine; }
        
        public List<String> getSaltComposition() { return saltComposition; }
        public void setSaltComposition(List<String> saltComposition) { this.saltComposition = saltComposition; }
        
        public List<Medicine> getGenericAlternatives() { return genericAlternatives; }
        public void setGenericAlternatives(List<Medicine> genericAlternatives) { this.genericAlternatives = genericAlternatives; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public boolean isFound() { return found; }
        public void setFound(boolean found) { this.found = found; }
        
        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }
    }
}
