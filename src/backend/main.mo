actor {
  public type StressPrediction = {
    stressed : Bool;
    confidence : Float;
    method : Text;
  };

  public func processTextAnalysisResult(isStressed : Bool, confidence : Float) : async StressPrediction {
    {
      stressed = isStressed;
      confidence;
      method = "text";
    };
  };

  public func processFacialAnalysisResult(isStressed : Bool, confidence : Float) : async StressPrediction {
    {
      stressed = isStressed;
      confidence;
      method = "facial";
    };
  };

  public func processVoiceAnalysisResult(isStressed : Bool, confidence : Float) : async StressPrediction {
    {
      stressed = isStressed;
      confidence;
      method = "voice";
    };
  };

  public query func getStressDetectionMethods() : async [Text] {
    ["text", "facial", "voice"];
  };
};
